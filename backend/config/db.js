const mysql = require('mysql2/promise');

// Configuración de la conexión a MySQL
// Orientado al entorno XAMPP local por defecto
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'learnup_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear el pool de conexiones
const pool = mysql.createPool(dbConfig);

// Validar la conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a la base de datos MySQL [learnup_db]');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos:\n', err.message);
  });

module.exports = pool;
