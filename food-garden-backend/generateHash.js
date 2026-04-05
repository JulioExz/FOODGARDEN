const bcrypt = require('bcryptjs');

const passwords = {
  'gerente123': null,
  'empleado123': null,
  'dueno123': null,
  'admin123': null
};

console.log('🔐 Generando hashes bcrypt...\n');

Object.keys(passwords).forEach(pwd => {
  const hash = bcrypt.hashSync(pwd, 10);
  passwords[pwd] = hash;
  console.log(`Password: ${pwd}`);
  console.log(`Hash: ${hash}`);
  console.log('---\n');
});

console.log('📋 Script SQL para actualizar:');
console.log('USE FoodGardenDB;');
console.log('GO\n');

console.log(`-- Gerentes (gerente123)`);
console.log(`UPDATE Usuarios SET password = '${passwords['gerente123']}' WHERE email IN ('pedro@foodgarden.com', 'ana@foodgarden.com', 'luis@foodgarden.com');\n`);

console.log(`-- Empleados (empleado123)`);
console.log(`UPDATE Usuarios SET password = '${passwords['empleado123']}' WHERE email IN ('sofia@foodgarden.com', 'miguel@foodgarden.com', 'carmen@foodgarden.com');\n`);

console.log(`-- Dueños (dueno123)`);
console.log(`UPDATE Usuarios SET password = '${passwords['dueno123']}' WHERE email IN ('carlos@foodgarden.com','maria@foodgarden.com','roberto@foodgarden.com','patricia@foodgarden.com','fernando@foodgarden.com');\n`);

console.log(`-- Admin (admin123)`);
console.log(`UPDATE Usuarios SET password = '${passwords['admin123']}' WHERE email = 'admin@foodgarden.com';\n`);

console.log('GO');