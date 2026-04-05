import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, email, rol, telefono, estado, "fechaCreacion"
      FROM "Usuarios"
      ORDER BY "fechaCreacion" DESC
    `);

    for (const usuario of result.rows) {
      if (usuario.rol === 'dueño') {
        const locales = await pool.query(
          `SELECT l.id, l.nombre FROM "Locales" l
           INNER JOIN "DuenoLocales" dl ON l.id = dl."localId"
           WHERE dl."duenoId" = $1`, [usuario.id]
        );
        usuario.locales = locales.rows;
      } else if (usuario.rol === 'gerente') {
        const locales = await pool.query(
          `SELECT l.id, l.nombre FROM "Locales" l
           INNER JOIN "GerenteLocales" gl ON l.id = gl."localId"
           WHERE gl."gerenteId" = $1`, [usuario.id]
        );
        usuario.locales = locales.rows;
      } else if (usuario.rol === 'empleado') {
        const locales = await pool.query(
          `SELECT l.id, l.nombre FROM "Locales" l
           INNER JOIN "Empleados" e ON l.id = e."localId"
           WHERE e."usuarioId" = $1`, [usuario.id]
        );
        usuario.locales = locales.rows;
      } else {
        usuario.locales = [];
      }
    }

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
};

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;

    if (!nombre || !email || !password || !rol) {
      res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
      return;
    }

    const emailCheck = await pool.query('SELECT id FROM "Usuarios" WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      res.status(400).json({ success: false, message: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO "Usuarios" (nombre, email, password, rol, telefono)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre, email, rol
    `, [nombre, email, hashedPassword, rol, telefono || null]);

    res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, estado } = req.body;

    await pool.query(`
      UPDATE "Usuarios"
      SET nombre = $1, email = $2, telefono = $3, estado = $4, "fechaActualizacion" = NOW()
      WHERE id = $5
    `, [nombre, email, telefono || null, estado, id]);

    res.json({ success: true, message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await pool.query(`UPDATE "Usuarios" SET estado = 'inactivo' WHERE id = $1`, [id]);

    res.json({ success: true, message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, telefono, email } = req.body;
    const usuarioId = req.user?.userId;

    if (!usuarioId) {
      res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      return;
    }

    if (email) {
      const emailExiste = await pool.query(
        'SELECT id FROM "Usuarios" WHERE email = $1 AND id != $2',
        [email, usuarioId]
      );
      if (emailExiste.rows.length > 0) {
        res.status(400).json({ success: false, message: 'El email ya está registrado' });
        return;
      }
    }

    await pool.query(`
      UPDATE "Usuarios"
      SET nombre = $1, telefono = $2, email = $3, "fechaActualizacion" = NOW()
      WHERE id = $4
    `, [nombre, telefono || null, email, usuarioId]);

    res.json({ success: true, message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuarioId = req.user?.userId;

    if (!usuarioId) {
      res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Contraseña actual y nueva son requeridas' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const result = await pool.query(
      'SELECT password FROM "Usuarios" WHERE id = $1', [usuarioId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    const passwordValido = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!passwordValido) {
      res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(`
      UPDATE "Usuarios"
      SET password = $1, "fechaActualizacion" = NOW()
      WHERE id = $2
    `, [hashedPassword, usuarioId]);

    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
  }
};