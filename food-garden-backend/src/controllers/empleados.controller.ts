import { Request, Response } from 'express';
import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

export const getEmpleados = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, rol } = req.user!;
    let query = '';
    const params: any[] = [];

    if (rol === 'admin') {
      query = `
        SELECT e.id, u.nombre, u.email, u.telefono,
          e."localId", l.nombre as "localNombre",
          e.puesto, e.salario, e."fechaContratacion", e.estado
        FROM "Empleados" e
        INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
        INNER JOIN "Locales" l ON e."localId" = l.id
        ORDER BY e."fechaContratacion" DESC
      `;
    } else if (rol === 'dueño') {
      params.push(userId);
      query = `
        SELECT e.id, u.nombre, u.email, u.telefono,
          e."localId", l.nombre as "localNombre",
          e.puesto, e.salario, e."fechaContratacion", e.estado
        FROM "Empleados" e
        INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
        INNER JOIN "Locales" l ON e."localId" = l.id
        INNER JOIN "DuenoLocales" dl ON l.id = dl."localId"
        WHERE dl."duenoId" = $1
        ORDER BY e."fechaContratacion" DESC
      `;
    } else if (rol === 'gerente') {
      params.push(userId);
      query = `
        SELECT e.id, u.nombre, u.email, u.telefono,
          e."localId", l.nombre as "localNombre",
          e.puesto, e.salario, e."fechaContratacion", e.estado
        FROM "Empleados" e
        INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
        INNER JOIN "Locales" l ON e."localId" = l.id
        INNER JOIN "GerenteLocales" gl ON l.id = gl."localId"
        WHERE gl."gerenteId" = $1
        ORDER BY e."fechaContratacion" DESC
      `;
    }

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ success: false, message: 'Error al obtener empleados' });
  }
};

export const getEmpleadoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;

    let extraCondition = '';
    const params: any[] = [id];

    if (rol === 'dueño') {
      params.push(userId);
      extraCondition = `AND EXISTS (
        SELECT 1 FROM "DuenoLocales" dl
        WHERE dl."localId" = e."localId" AND dl."duenoId" = $${params.length}
      )`;
    } else if (rol === 'gerente') {
      params.push(userId);
      extraCondition = `AND EXISTS (
        SELECT 1 FROM "GerenteLocales" gl
        WHERE gl."localId" = e."localId" AND gl."gerenteId" = $${params.length}
      )`;
    }

    const result = await pool.query(`
      SELECT e.id, u.nombre, u.email, u.telefono,
        e."localId", l.nombre as "localNombre",
        e.puesto, e.salario, e."fechaContratacion", e.estado
      FROM "Empleados" e
      INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
      INNER JOIN "Locales" l ON e."localId" = l.id
      WHERE e.id = $1 ${extraCondition}
    `, params);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Empleado no encontrado o no tienes permiso para verlo' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ success: false, message: 'Error al obtener empleado' });
  }
};

export const getEmpleadosByLocal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { localId } = req.params;
    const { userId, rol } = req.user!;

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [localId, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para ver este local' });
        return;
      }
    } else if (rol === 'gerente') {
      const permiso = await pool.query(
        'SELECT 1 FROM "GerenteLocales" WHERE "localId" = $1 AND "gerenteId" = $2',
        [localId, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para ver este local' });
        return;
      }
    }

    const result = await pool.query(`
      SELECT e.id, u.nombre, u.email, u.telefono, e.puesto, e.salario, e.estado
      FROM "Empleados" e
      INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
      WHERE e."localId" = $1
      ORDER BY u.nombre
    `, [localId]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener empleados por local:', error);
    res.status(500).json({ success: false, message: 'Error al obtener empleados' });
  }
};

export const createEmpleado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, rol } = req.user!;
    const { nombre, email, telefono, password, localId, puesto, salario, fechaContratacion } = req.body;

    if (!nombre || !email || !password || !localId || !puesto || !salario) {
      res.status(400).json({ success: false, message: 'Todos los campos requeridos deben ser proporcionados' });
      return;
    }

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [localId, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No puedes crear empleados en este local' });
        return;
      }
    } else if (rol === 'gerente') {
      const permiso = await pool.query(
        'SELECT 1 FROM "GerenteLocales" WHERE "localId" = $1 AND "gerenteId" = $2',
        [localId, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No puedes crear empleados en este local' });
        return;
      }
    }

    const emailExiste = await pool.query('SELECT id FROM "Usuarios" WHERE email = $1', [email]);
    if (emailExiste.rows.length > 0) {
      res.status(400).json({ success: false, message: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuarioResult = await pool.query(`
      INSERT INTO "Usuarios" (nombre, email, password, rol, telefono)
      VALUES ($1, $2, $3, 'empleado', $4)
      RETURNING id
    `, [nombre, email, hashedPassword, telefono || null]);

    const usuarioId = usuarioResult.rows[0].id;

    const empleadoResult = await pool.query(`
      INSERT INTO "Empleados" ("usuarioId", "localId", puesto, salario, "fechaContratacion")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [usuarioId, localId, puesto, salario, fechaContratacion || new Date()]);

    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: { id: empleadoResult.rows[0].id, usuarioId },
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ success: false, message: 'Error al crear empleado' });
  }
};

export const updateEmpleado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;
    const { nombre, email, telefono, localId, puesto, salario, estado } = req.body;

    const empleadoActual = await pool.query(
      'SELECT "usuarioId", "localId" FROM "Empleados" WHERE id = $1', [id]
    );

    if (empleadoActual.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Empleado no encontrado' });
      return;
    }

    const { usuarioId: usuarioIdEmpleado, localId: localActual } = empleadoActual.rows[0];

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [localActual, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para editar este empleado' });
        return;
      }
    } else if (rol === 'gerente') {
      const permiso = await pool.query(
        'SELECT 1 FROM "GerenteLocales" WHERE "localId" = $1 AND "gerenteId" = $2',
        [localActual, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para editar este empleado' });
        return;
      }
    }

    await pool.query(
      'UPDATE "Usuarios" SET nombre = $1, email = $2, telefono = $3 WHERE id = $4',
      [nombre, email, telefono || null, usuarioIdEmpleado]
    );

    await pool.query(
      'UPDATE "Empleados" SET "localId" = $1, puesto = $2, salario = $3, estado = $4 WHERE id = $5',
      [localId, puesto, salario, estado, id]
    );

    res.json({ success: true, message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar empleado' });
  }
};

export const deleteEmpleado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;

    if (rol === 'dueño') {
      const permiso = await pool.query(`
        SELECT 1 FROM "Empleados" e
        INNER JOIN "DuenoLocales" dl ON e."localId" = dl."localId"
        WHERE e.id = $1 AND dl."duenoId" = $2
      `, [id, userId]);

      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este empleado' });
        return;
      }
    }

    const result = await pool.query(
      `UPDATE "Empleados" SET estado = 'inactivo' WHERE id = $1`, [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Empleado no encontrado' });
      return;
    }

    res.json({ success: true, message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar empleado' });
  }
};