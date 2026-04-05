import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getLocales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, rol } = req.user!;
    let query = '';
    const params: any[] = [];

    if (rol === 'admin') {
      query = `
        SELECT 
          l.id, l.nombre, l.descripcion, l.categoria, l.estado,
          l.ubicacion, l.telefono, l.horario, l.imagen, l."fechaCreacion",
          STRING_AGG(u.nombre, ', ') as duenos
        FROM "Locales" l
        LEFT JOIN "DuenoLocales" dl ON l.id = dl."localId"
        LEFT JOIN "Usuarios" u ON dl."duenoId" = u.id
        GROUP BY l.id, l.nombre, l.descripcion, l.categoria, l.estado,
                 l.ubicacion, l.telefono, l.horario, l.imagen, l."fechaCreacion"
        ORDER BY l."fechaCreacion" DESC
      `;
    } else if (rol === 'dueño') {
      params.push(userId);
      query = `
        SELECT l.id, l.nombre, l.descripcion, l.categoria, l.estado,
          l.ubicacion, l.telefono, l.horario, l.imagen, l."fechaCreacion"
        FROM "Locales" l
        INNER JOIN "DuenoLocales" dl ON l.id = dl."localId"
        WHERE dl."duenoId" = $1
        ORDER BY l."fechaCreacion" DESC
      `;
    } else if (rol === 'gerente') {
      params.push(userId);
      query = `
        SELECT l.id, l.nombre, l.descripcion, l.categoria, l.estado,
          l.ubicacion, l.telefono, l.horario, l.imagen, l."fechaCreacion"
        FROM "Locales" l
        INNER JOIN "GerenteLocales" gl ON l.id = gl."localId"
        WHERE gl."gerenteId" = $1
        ORDER BY l."fechaCreacion" DESC
      `;
    } else if (rol === 'empleado') {
      params.push(userId);
      query = `
        SELECT l.id, l.nombre, l.descripcion, l.categoria, l.estado,
          l.ubicacion, l.telefono, l.horario, l.imagen, l."fechaCreacion"
        FROM "Locales" l
        INNER JOIN "Empleados" e ON l.id = e."localId"
        WHERE e."usuarioId" = $1
      `;
    }

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener locales:', error);
    res.status(500).json({ success: false, message: 'Error al obtener locales' });
  }
};

export const getLocalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [id, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para ver este local' });
        return;
      }
    } else if (rol === 'gerente') {
      const permiso = await pool.query(
        'SELECT 1 FROM "GerenteLocales" WHERE "localId" = $1 AND "gerenteId" = $2',
        [id, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para ver este local' });
        return;
      }
    } else if (rol === 'empleado') {
      const permiso = await pool.query(
        'SELECT 1 FROM "Empleados" WHERE "localId" = $1 AND "usuarioId" = $2',
        [id, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para ver este local' });
        return;
      }
    }

    const result = await pool.query(`
      SELECT id, nombre, descripcion, categoria, estado,
        ubicacion, telefono, horario, imagen, "fechaCreacion"
      FROM "Locales" WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Local no encontrado' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener local:', error);
    res.status(500).json({ success: false, message: 'Error al obtener local' });
  }
};

export const createLocal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, rol } = req.user!;
    const { nombre, descripcion, duenoId, categoria, ubicacion, telefono, horario, imagen } = req.body;

    if (!nombre || !categoria) {
      res.status(400).json({ success: false, message: 'Nombre y categoría son requeridos' });
      return;
    }

    const finalDuenoId = rol === 'dueño' ? userId : duenoId;
    if (!finalDuenoId) {
      res.status(400).json({ success: false, message: 'Dueño es requerido' });
      return;
    }

    const result = await pool.query(`
      INSERT INTO "Locales" (nombre, descripcion, categoria, ubicacion, telefono, horario, imagen)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nombre, categoria, estado, "fechaCreacion"
    `, [nombre, descripcion || null, categoria, ubicacion || null, telefono || null, horario || null, imagen || null]);

    const nuevoLocal = result.rows[0];

    await pool.query(
      'INSERT INTO "DuenoLocales" ("duenoId", "localId") VALUES ($1, $2)',
      [finalDuenoId, nuevoLocal.id]
    );

    res.status(201).json({ success: true, message: 'Local creado exitosamente', data: nuevoLocal });
  } catch (error) {
    console.error('Error al crear local:', error);
    res.status(500).json({ success: false, message: 'Error al crear local' });
  }
};

export const updateLocal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;
    const { nombre, descripcion, categoria, estado, ubicacion, telefono, horario, imagen } = req.body;

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [id, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para editar este local' });
        return;
      }
    }

    const result = await pool.query(`
      UPDATE "Locales"
      SET nombre = $1, descripcion = $2, categoria = $3, estado = $4,
          ubicacion = $5, telefono = $6, horario = $7, imagen = $8
      WHERE id = $9
    `, [nombre, descripcion, categoria, estado, ubicacion, telefono, horario, imagen || null, id]);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Local no encontrado' });
      return;
    }

    res.json({ success: true, message: 'Local actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar local:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar local' });
  }
};

export const deleteLocal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, rol } = req.user!;

    if (rol === 'dueño') {
      const permiso = await pool.query(
        'SELECT 1 FROM "DuenoLocales" WHERE "localId" = $1 AND "duenoId" = $2',
        [id, userId]
      );
      if (permiso.rows.length === 0) {
        res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este local' });
        return;
      }
    }

    const result = await pool.query(
      `UPDATE "Locales" SET estado = 'inactivo' WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Local no encontrado' });
      return;
    }

    res.json({ success: true, message: 'Local eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar local:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar local' });
  }
};