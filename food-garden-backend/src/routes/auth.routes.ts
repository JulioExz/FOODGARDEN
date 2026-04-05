import { Router } from 'express';
import { login, getCurrentUser, register } from '../controllers/auth.controller';
import { updateProfile, changePassword } from '../controllers/usuarios.controller';
import { verifyToken, verifyRole } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.get('/me', verifyToken, getCurrentUser);
router.post('/register', verifyToken, verifyRole(['admin']), register);

// Rutas de perfil
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

export default router;