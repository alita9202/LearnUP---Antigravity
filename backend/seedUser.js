const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createUser() {
  try {
    const password = await bcrypt.hash('123456', 10);

    const sql = `
      INSERT INTO users (name, email, password, role, phone, cv_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      'Admin Demo',
      'admin@demo.com',
      password,
      'admin',
      '70000000',
      null
    ];

    await db.execute(sql, values);

    console.log('✅ Usuario creado correctamente');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createUser();