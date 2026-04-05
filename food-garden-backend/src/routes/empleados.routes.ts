import { Router } from 'express';
import {
  getEmpleados,
  getEmpleadoById,
  getEmpleadosByLocal,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from '../controllers/empleados.controller';
import { verifyToken, verifyRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los empleados
router.get('/', getEmpleados);

// Obtener empleado por ID
router.get('/:id', getEmpleadoById);

// Obtener empleados por local
router.get('/local/:localId', getEmpleadosByLocal);

// Crear nuevo empleado (solo admin y gerente)
router.post('/', verifyRole(['admin', 'gerente', 'dueño']), createEmpleado);

// Actualizar empleado (solo admin y gerente)
router.put('/:id', verifyRole(['admin', 'gerente', 'dueño']), updateEmpleado);

// Eliminar empleado (solo admin)
router.delete('/:id', verifyRole(['admin', 'dueño']), deleteEmpleado);

export default router;