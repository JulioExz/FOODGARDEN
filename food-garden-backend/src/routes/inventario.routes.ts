import { Router } from 'express';
import {
  getInventario,
  getInventarioByLocal,
  createMovimiento,
  getMovimientos,
  getProductosStockBajo,
  createProducto,
  updateProducto,
} from '../controllers/inventario.controller';
import { verifyToken, verifyRole } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todo el inventario
router.get('/', getInventario);

// Obtener productos con stock bajo
router.get('/stock-bajo', getProductosStockBajo);

// Obtener inventario por local
router.get('/local/:localId', getInventarioByLocal);

// Obtener movimientos de inventario
router.get('/movimientos', getMovimientos);

// Crear movimiento de inventario (entrada/salida)
router.post('/movimiento', createMovimiento);

// Crear nuevo producto
router.post('/producto', verifyRole(['admin', 'gerente', 'dueño']), createProducto);

// Actualizar producto
router.put('/producto/:id', verifyRole(['admin', 'gerente', 'dueño']), updateProducto);

export default router;