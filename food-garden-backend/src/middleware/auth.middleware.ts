import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        rol: string;
        localId?: number; // Para gerentes/empleados
      };
    }
  }
}

// Middleware para verificar el token JWT
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as {
      userId: number;
      email: string;
      rol: string;
      localId?: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error al verificar token',
    });
  }
};

// Middleware para verificar roles específicos
export const verifyRole = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
      });
      return;
    }

    next();
  };
};

// Nuevo: Middleware para verificar que el usuario solo acceda a sus datos
export const verifyOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
      });
      return;
    }

    const { rol, userId, localId } = req.user;
    const resourceId = req.params.id || req.params.localId;

    // Admin puede acceder a todo
    if (rol === 'admin') {
      next();
      return;
    }

    // Dueño: verificar que el recurso le pertenece
    if (rol === 'dueño') {
      // Aquí verificaremos en la BD si el recurso pertenece al dueño
      // Por ahora pasamos, lo implementaremos en cada controlador
      next();
      return;
    }

    // Gerente/Empleado: solo puede acceder a su local asignado
    if (rol === 'gerente' || rol === 'empleado') {
      if (!localId) {
        res.status(403).json({
          success: false,
          message: 'No tienes local asignado',
        });
        return;
      }
      
      // Verificar que el recurso pertenece a su local
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Rol no válido',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar permisos',
    });
  }
};

// Helpers para verificaciones comunes
export const canManageLocales = verifyRole(['admin', 'dueño']);
export const canManageEmployees = verifyRole(['admin', 'dueño', 'gerente']);
export const canRegisterSales = verifyRole(['admin', 'dueño', 'gerente', 'empleado']);
export const canManageInventory = verifyRole(['admin', 'dueño', 'gerente']);
export const canViewReports = verifyRole(['admin', 'dueño', 'gerente']);
export const adminOnly = verifyRole(['admin']);