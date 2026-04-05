const bcrypt = require('bcryptjs');
const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_DATABASE || 'FoodGardenDB',
  user: process.env.DB_USER || 'foodgarden_user',
  password: process.env.DB_PASSWORD || 'admin',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

async function createAdmin() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    const pool = await sql.connect(config);
    console.log('✅ Conectado!');
    
    console.log('\n🔐 Generando hash de contraseña...');
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('\n🗑️  Eliminando usuario admin anterior...');
    await pool.request().query(`
      DELETE FROM Usuarios WHERE email = 'admin@foodgarden.com'
    `);
    
    console.log('✨ Creando nuevo usuario admin...');
    await pool.request()
      .input('nombre', sql.NVarChar, 'Admin Principal')
      .input('email', sql.NVarChar, 'admin@foodgarden.com')
      .input('password', sql.NVarChar, hashedPassword)
      .input('rol', sql.NVarChar, 'admin')
      .input('telefono', sql.NVarChar, '664-123-4567')
      .input('estado', sql.NVarChar, 'activo')
      .query(`
        INSERT INTO Usuarios (nombre, email, password, rol, telefono, estado)
        VALUES (@nombre, @email, @password, @rol, @telefono, @estado)
      `);
    
    console.log('\n✅ Usuario admin creado correctamente!');
    console.log('\n📋 Credenciales:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@foodgarden.com');
    console.log('Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Verificar
    console.log('\n🔍 Verificando usuario creado...');
    const verify = await pool.request()
      .input('email', sql.NVarChar, 'admin@foodgarden.com')
      .query('SELECT id, nombre, email, rol, estado FROM Usuarios WHERE email = @email');
    
    console.log('Usuario encontrado:', verify.recordset[0]);
    
    await pool.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();