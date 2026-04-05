import { Request, Response } from 'express';
import { pool } from '../config/database';

export const getVentas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, fechaFin, localId } = req.query;
    const params: any[] = [];
    let conditions = '';

    if (fechaInicio) { params.push(fechaInicio); conditions += ` AND v.fecha >= $${params.length}`; }
    if (fechaFin) { params.push(fechaFin); conditions += ` AND v.fecha <= $${params.length}`; }
    if (localId) { params.push(localId); conditions += ` AND v."localId" = $${params.length}`; }

    const result = await pool.query(`
      SELECT 
        v.id, v."localId", l.nombre as "localNombre",
        v."empleadoId", u.nombre as "empleadoNombre",
        v.subtotal, v.impuestos, v.total, v."metodoPago", v.estado, v.fecha
      FROM "Ventas" v
      INNER JOIN "Locales" l ON v."localId" = l.id
      INNER JOIN "Empleados" e ON v."empleadoId" = e.id
      INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
      WHERE 1=1 ${conditions}
      ORDER BY v.fecha DESC
    `, params);

    for (const venta of result.rows) {
      const detalles = await pool.query(`
        SELECT 
          dv."productoId", p.nombre, dv.cantidad,
          dv."precioUnitario", dv.subtotal
        FROM "DetalleVentas" dv
        INNER JOIN "Productos" p ON dv."productoId" = p.id
        WHERE dv."ventaId" = $1
      `, [venta.id]);
      venta.productos = detalles.rows;
    }

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ventas' });
  }
};

export const getVentaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        v.id, v."localId", l.nombre as "localNombre",
        v."empleadoId", u.nombre as "empleadoNombre",
        v.subtotal, v.impuestos, v.total, v."metodoPago", v.estado, v.fecha
      FROM "Ventas" v
      INNER JOIN "Locales" l ON v."localId" = l.id
      INNER JOIN "Empleados" e ON v."empleadoId" = e.id
      INNER JOIN "Usuarios" u ON e."usuarioId" = u.id
      WHERE v.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Venta no encontrada' });
      return;
    }

    const venta = result.rows[0];
    const detalles = await pool.query(`
      SELECT dv."productoId", p.nombre, dv.cantidad, dv."precioUnitario", dv.subtotal
      FROM "DetalleVentas" dv
      INNER JOIN "Productos" p ON dv."productoId" = p.id
      WHERE dv."ventaId" = $1
    `, [id]);
    venta.productos = detalles.rows;

    res.json({ success: true, data: venta });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ success: false, message: 'Error al obtener venta' });
  }
};

export const createVenta = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    const { localId, empleadoId, productos, subtotal, impuestos, total, metodoPago } = req.body;

    if (!localId || !empleadoId || !productos || productos.length === 0) {
      res.status(400).json({ success: false, message: 'Datos incompletos para crear la venta' });
      return;
    }

    await client.query('BEGIN');

    const ventaResult = await client.query(`
      INSERT INTO "Ventas" ("localId", "empleadoId", subtotal, impuestos, total, "metodoPago")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [localId, empleadoId, subtotal, impuestos, total, metodoPago]);

    const ventaId = ventaResult.rows[0].id;

    for (const producto of productos) {
      await client.query(`
        INSERT INTO "DetalleVentas" ("ventaId", "productoId", cantidad, "precioUnitario", subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `, [ventaId, producto.productoId, producto.cantidad, producto.precioUnitario, producto.subtotal]);

      await client.query(
        'UPDATE "Productos" SET stock = stock - $1 WHERE id = $2',
        [producto.cantidad, producto.productoId]
      );

      await client.query(`
        INSERT INTO "MovimientosInventario" ("productoId", "empleadoId", tipo, cantidad, motivo)
        VALUES ($1, $2, 'salida', $3, 'Venta')
      `, [producto.productoId, empleadoId, producto.cantidad]);
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Venta registrada exitosamente', data: { ventaId } });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear venta:', error);
    res.status(500).json({ success: false, message: 'Error al registrar venta' });
  } finally {
    client.release();
  }
};

export const getReporteVentas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const totalVentas = await pool.query(`
      SELECT 
        SUM(total) as "totalVentas",
        COUNT(*) as "cantidadOrdenes",
        AVG(total) as "ticketPromedio"
      FROM "Ventas"
      WHERE fecha >= $1 AND fecha <= $2 AND estado = 'completada'
    `, [fechaInicio, fechaFin]);

    const ventasPorLocal = await pool.query(`
      SELECT 
        l.id as "localId", l.nombre as "localNombre",
        SUM(v.total) as "totalVentas", COUNT(*) as "cantidadOrdenes"
      FROM "Ventas" v
      INNER JOIN "Locales" l ON v."localId" = l.id
      WHERE v.fecha >= $1 AND v.fecha <= $2 AND v.estado = 'completada'
      GROUP BY l.id, l.nombre
      ORDER BY "totalVentas" DESC
    `, [fechaInicio, fechaFin]);

    const productosMasVendidos = await pool.query(`
      SELECT 
        p.id as "productoId", p.nombre,
        SUM(dv.cantidad) as "cantidadVendida",
        SUM(dv.subtotal) as "totalVentas"
      FROM "DetalleVentas" dv
      INNER JOIN "Productos" p ON dv."productoId" = p.id
      INNER JOIN "Ventas" v ON dv."ventaId" = v.id
      WHERE v.fecha >= $1 AND v.fecha <= $2 AND v.estado = 'completada'
      GROUP BY p.id, p.nombre
      ORDER BY "cantidadVendida" DESC
      LIMIT 10
    `, [fechaInicio, fechaFin]);

    res.json({
      success: true,
      data: {
        resumen: totalVentas.rows[0],
        ventasPorLocal: ventasPorLocal.rows,
        productosMasVendidos: productosMasVendidos.rows,
      },
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ success: false, message: 'Error al obtener reporte de ventas' });
  }
};