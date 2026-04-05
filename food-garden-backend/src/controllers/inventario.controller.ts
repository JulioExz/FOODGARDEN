import { Request, Response } from 'express';
import { getConnection } from '../config/database';

// Obtener todos los productos (inventario)
export const getInventario = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        p.ProductoID as id,
        p.LocalID as localId,
        l.Nombre as localNombre,
        p.Nombre as nombre,
        p.Descripcion as descripcion,
        p.Precio as precio,
        p.Categoria as categoria,
        p.Stock as stock,
        p.StockMinimo as stockMinimo,
        p.Imagen as imagen,
        p.Estado as estado,
        p.FechaCreacion as fechaCreacion
      FROM Productos p
      INNER JOIN Locales l ON p.LocalID = l.LocalID
      ORDER BY p.Nombre
    `);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
    });
  }
};

// Obtener inventario por local
export const getInventarioByLocal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { localId } = req.params;
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('localId', localId)
      .query(`
        SELECT 
          ProductoID as id,
          Nombre as nombre,
          Descripcion as descripcion,
          Precio as precio,
          Categoria as categoria,
          Stock as stock,
          StockMinimo as stockMinimo,
          Estado as estado
        FROM Productos
        WHERE LocalID = @localId
        ORDER BY Nombre
      `);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener inventario por local:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener inventario',
    });
  }
};

// Crear movimiento de inventario (entrada/salida)
export const createMovimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productoId, empleadoId, tipo, cantidad, motivo } = req.body;

    // Validar campos requeridos
    if (!productoId || !empleadoId || !tipo || !cantidad || !motivo) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
      });
      return;
    }

    const pool = await getConnection();
    const transaction = pool.transaction();

    try {
      await transaction.begin();

      // Verificar stock actual si es salida
      if (tipo === 'salida') {
        const stockActual = await transaction
          .request()
          .input('productoId', productoId)
          .query('SELECT Stock FROM Productos WHERE ProductoID = @productoId');

        if (stockActual.recordset.length === 0) {
          await transaction.rollback();
          res.status(404).json({
            success: false,
            message: 'Producto no encontrado',
          });
          return;
        }

        if (stockActual.recordset[0].Stock < cantidad) {
          await transaction.rollback();
          res.status(400).json({
            success: false,
            message: 'Stock insuficiente',
          });
          return;
        }
      }

      // Registrar movimiento
      await transaction
        .request()
        .input('productoId', productoId)
        .input('empleadoId', empleadoId)
        .input('tipo', tipo)
        .input('cantidad', cantidad)
        .input('motivo', motivo)
        .query(`
          INSERT INTO MovimientosInventario (ProductoID, EmpleadoID, Tipo, Cantidad, Motivo)
          VALUES (@productoId, @empleadoId, @tipo, @cantidad, @motivo)
        `);

      // Actualizar stock
      if (tipo === 'entrada') {
        await transaction
          .request()
          .input('productoId', productoId)
          .input('cantidad', cantidad)
          .query(`
            UPDATE Productos
            SET Stock = Stock + @cantidad
            WHERE ProductoID = @productoId
          `);
      } else {
        await transaction
          .request()
          .input('productoId', productoId)
          .input('cantidad', cantidad)
          .query(`
            UPDATE Productos
            SET Stock = Stock - @cantidad
            WHERE ProductoID = @productoId
          `);
      }

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Movimiento registrado exitosamente',
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar movimiento',
    });
  }
};

// Obtener historial de movimientos
export const getMovimientos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productoId, fechaInicio, fechaFin } = req.query;
    const pool = await getConnection();

    let query = `
      SELECT 
        m.MovimientoID as id,
        m.ProductoID as productoId,
        p.Nombre as productoNombre,
        p.LocalID as localId,
        m.EmpleadoID as empleadoId,
        u.Nombre as responsableNombre,
        m.Tipo as tipo,
        m.Cantidad as cantidad,
        m.Motivo as motivo,
        m.Fecha as fecha
      FROM MovimientosInventario m
      INNER JOIN Productos p ON m.ProductoID = p.ProductoID
      INNER JOIN Empleados e ON m.EmpleadoID = e.EmpleadoID
      INNER JOIN Usuarios u ON e.UsuarioID = u.UsuarioID
      WHERE 1=1
    `;

    const request = pool.request();

    if (productoId) {
      query += ' AND m.ProductoID = @productoId';
      request.input('productoId', productoId as string);
    }

    if (fechaInicio) {
      query += ' AND m.Fecha >= @fechaInicio';
      request.input('fechaInicio', fechaInicio as string);
    }

    if (fechaFin) {
      query += ' AND m.Fecha <= @fechaFin';
      request.input('fechaFin', fechaFin as string);
    }

    query += ' ORDER BY m.Fecha DESC';

    const result = await request.query(query);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener movimientos',
    });
  }
};

// Obtener productos con stock bajo
export const getProductosStockBajo = async (req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT 
        p.ProductoID as id,
        p.Nombre as nombre,
        p.LocalID as localId,
        l.Nombre as localNombre,
        p.Stock as stock,
        p.StockMinimo as stockMinimo,
        p.Categoria as categoria
      FROM Productos p
      INNER JOIN Locales l ON p.LocalID = l.LocalID
      WHERE p.Stock <= p.StockMinimo
      ORDER BY p.Stock ASC
    `);

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos con stock bajo',
    });
  }
};

// Crear nuevo producto
export const createProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      localId,
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      stockMinimo,
      imagen,
    } = req.body;

    // Validar campos requeridos
    if (!localId || !nombre || !precio || !categoria) {
      res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
      });
      return;
    }

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('localId', localId)
      .input('nombre', nombre)
      .input('descripcion', descripcion || null)
      .input('precio', precio)
      .input('categoria', categoria)
      .input('stock', stock || 0)
      .input('stockMinimo', stockMinimo || 10)
      .input('imagen', imagen || null)
      .query(`
        INSERT INTO Productos (
          LocalID, Nombre, Descripcion, Precio, 
          Categoria, Stock, StockMinimo, Imagen
        )
        OUTPUT INSERTED.ProductoID
        VALUES (
          @localId, @nombre, @descripcion, @precio,
          @categoria, @stock, @stockMinimo, @imagen
        )
      `);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: { productoId: result.recordset[0].ProductoID },
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
    });
  }
};

// Actualizar producto
export const updateProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      stockMinimo,
      imagen,
      estado,
    } = req.body;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('productoId', id)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('precio', precio)
      .input('categoria', categoria)
      .input('stockMinimo', stockMinimo)
      .input('imagen', imagen || null)
      .input('estado', estado)
      .query(`
        UPDATE Productos
        SET 
          Nombre = @nombre,
          Descripcion = @descripcion,
          Precio = @precio,
          Categoria = @categoria,
          StockMinimo = @stockMinimo,
          Imagen = @imagen,
          Estado = @estado
        WHERE ProductoID = @productoId
      `);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
    });
  }
};