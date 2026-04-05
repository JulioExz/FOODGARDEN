import { Router } from 'express';
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controller';
import { verifyToken, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren ser admin
router.use(verifyToken);
router.use(adminOnly);

router.get('/', getUsuarios);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;