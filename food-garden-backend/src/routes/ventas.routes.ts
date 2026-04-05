import { Router } from 'express';
import {
  getVentas,
  getVentaById,
  createVenta,
  getReporteVentas,
} from '../controllers/ventas.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todas las ventas
router.get('/', getVentas);

// Obtener reporte de ventas
router.get('/reporte', getReporteVentas);

// Obtener venta por ID
router.get('/:id', getVentaById);

// Crear nueva venta
router.post('/', createVenta);

export default router;