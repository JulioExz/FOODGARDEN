import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getConnection, closeConnection } from './config/database';

// Importar rutas
import authRoutes from './routes/auth.routes';
import localesRoutes from './routes/locales.routes';
import empleadosRoutes from './routes/empleados.routes';
import ventasRoutes from './routes/ventas.routes';
import inventarioRoutes from './routes/inventario.routes';
import usuariosRoutes from './routes/usuarios.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/locales', localesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API Food Garden - Sistema de Gestión',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      locales: '/api/locales',
      empleados: '/api/empleados',
      ventas: '/api/ventas',
      inventario: '/api/inventario',
    },
  });
});

// Ruta para verificar estado del servidor
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await getConnection();
    console.log('✅ Conexión a la base de datos establecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log('║   🚀 SERVIDOR INICIADO CORRECTAMENTE   ║');
      console.log('╚════════════════════════════════════════╝');
      console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📊 API disponible en: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log('════════════════════════════════════════');
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📁 Base de datos: ${process.env.DB_DATABASE}`);
      console.log('════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n⚠️  Cerrando servidor...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Cerrando servidor...');
  await closeConnection();
  process.exit(0);
});

// Iniciar el servidor
startServer();

export default app;