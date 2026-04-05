import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
      return;
    }

    const result = await pool.query(
      `SELECT id, nombre, email, password, rol, telefono, estado
       FROM "Usuarios" WHERE email = $1 AND estado = 'activo'`,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const usuario = result.rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    await pool.query(
      `UPDATE "Usuarios" SET "fechaActualizacion" = NOW() WHERE id = $1`,
      [usuario.id]
    );

    let locales: any[] = [];
    if (usuario.rol === 'dueño') {
      const r = await pool.query(
        `SELECT l.id, l.nombre FROM "Locales" l
         INNER JOIN "DuenoLocales" dl ON l.id = dl."localId"
         WHERE dl."duenoId" = $1`, [usuario.id]
      );
      locales = r.rows;
    } else if (usuario.rol === 'gerente') {
      const r = await pool.query(
        `SELECT l.id, l.nombre FROM "Locales" l
         INNER JOIN "GerenteLocales" gl ON l.id = gl."localId"
         WHERE gl."gerenteId" = $1`, [usuario.id]
      );
      locales = r.rows;
    } else if (usuario.rol === 'empleado') {
      const r = await pool.query(
        `SELECT l.id, l.nombre FROM "Locales" l
         INNER JOIN "Empleados" e ON l.id = e."localId"
         WHERE e."usuarioId" = $1`, [usuario.id]
      );
      locales = r.rows;
    }

    const token = jwt.sign(
   { userId: usuario.id, email: usuario.email, rol: usuario.rol },
   process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          telefono: usuario.telefono,
          locales,
        },
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      return;
    }

    const result = await pool.query(
      `SELECT id, nombre, email, rol, telefono, "fechaCreacion"
       FROM "Usuarios" WHERE id = $1 AND estado = 'activo'`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener usuario' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol, telefono } = req.body;

    if (!nombre || !email || !password || !rol) {
      res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
      return;
    }

    const emailExiste = await pool.query(
      'SELECT id FROM "Usuarios" WHERE email = $1', [email]
    );

    if (emailExiste.rows.length > 0) {
      res.status(400).json({ success: false, message: 'El email ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO "Usuarios" (nombre, email, password, rol, telefono)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, email, rol`,
      [nombre, email, hashedPassword, rol, telefono || null]
    );

    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};