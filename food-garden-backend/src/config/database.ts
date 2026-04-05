import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'FoodGardendb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
});

// Función para obtener la conexión
export const getConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    client.release();
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    throw error;
  }
};

// Función para cerrar la conexión
export const closeConnection = async (): Promise<void> => {
  try {
    await pool.end();
    console.log('✅ Conexión a PostgreSQL cerrada correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
    throw error;
  }
};

export { pool };