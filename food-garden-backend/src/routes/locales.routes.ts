import { Router } from 'express';
import {
  getLocales,
  getLocalById,
  createLocal,
  updateLocal,
  deleteLocal,
} from '../controllers/locales.controller';
import { verifyToken, verifyRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los locales (todos los roles autenticados)
router.get('/', getLocales);

// Obtener local por ID (todos los roles autenticados)
router.get('/:id', getLocalById);

// Crear nuevo local (solo admin y dueño)
router.post('/', verifyRole(['admin', 'dueño']), createLocal);

// Actualizar local (solo admin y dueño - validación extra en controller)
router.put('/:id', verifyRole(['admin', 'dueño']), updateLocal);

// Eliminar local (solo admin y dueño - validación extra en controller)
router.delete('/:id', verifyRole(['admin', 'dueño']), deleteLocal);

export default router;