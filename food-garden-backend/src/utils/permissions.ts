import { Request } from 'express';
import { getConnection } from '../config/database';

export class PermissionsHelper {
  // Verificar si el usuario puede acceder a un local
  static async canAccessLocal(userId: number, rol: string, localId: number): Promise<boolean> {
    try {
      const pool = await getConnection();

      // Admin puede acceder a todo
      if (rol === 'admin') {
        return true;
      }

      // Dueño: verificar si es dueño del local
      if (rol === 'dueño') {
        const result = await pool
          .request()
          .input('dueñoId', userId)
          .input('localId', localId)
          .query(`
            SELECT COUNT(*) as count
            FROM DueñoLocales
            WHERE dueñoId = @dueñoId AND localId = @localId
          `);
        
        return result.recordset[0].count > 0;
      }

      // Gerente: verificar si está asignado al local
      if (rol === 'gerente') {
        const result = await pool
          .request()
          .input('gerenteId', userId)
          .input('localId', localId)
          .query(`
            SELECT COUNT(*) as count
            FROM GerenteLocales
            WHERE gerenteId = @gerenteId AND localId = @localId
          `);
        
        return result.recordset[0].count > 0;
      }

      // Empleado: verificar si está asignado al local
      if (rol === 'empleado') {
        const result = await pool
          .request()
          .input('empleadoId', userId)
          .input('localId', localId)
          .query(`
            SELECT COUNT(*) as count
            FROM Empleados
            WHERE UsuarioID = @empleadoId AND LocalID = @localId AND Estado = 'activo'
          `);
        
        return result.recordset[0].count > 0;
      }

      return false;
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }

  // Obtener IDs de locales a los que el usuario tiene acceso
  static async getUserLocales(userId: number, rol: string): Promise<number[]> {
    try {
      const pool = await getConnection();

      // Admin puede ver todos
      if (rol === 'admin') {
        const result = await pool.request().query(`
          SELECT LocalID FROM Locales WHERE Estado = 'activo'
        `);
        return result.recordset.map((r: any) => r.LocalID);
      }

      // Dueño: sus locales
      if (rol === 'dueño') {
        const result = await pool
          .request()
          .input('dueñoId', userId)
          .query(`
            SELECT localId FROM DueñoLocales WHERE dueñoId = @dueñoId
          `);
        return result.recordset.map((r: any) => r.localId);
      }

      // Gerente: locales asignados
      if (rol === 'gerente') {
        const result = await pool
          .request()
          .input('gerenteId', userId)
          .query(`
            SELECT localId FROM GerenteLocales WHERE gerenteId = @gerenteId
          `);
        return result.recordset.map((r: any) => r.localId);
      }

      // Empleado: su local
      if (rol === 'empleado') {
        const result = await pool
          .request()
          .input('empleadoId', userId)
          .query(`
            SELECT LocalID FROM Empleados 
            WHERE UsuarioID = @empleadoId AND Estado = 'activo'
          `);
        return result.recordset.map((r: any) => r.LocalID);
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo locales del usuario:', error);
      return [];
    }
  }
}