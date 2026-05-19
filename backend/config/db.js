const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'learnup_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com')
    ? { rejectUnauthorized: false }
    : undefined
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
  .then((connection) => {
    console.log('✅ Conectado a la base de datos MySQL');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Error conectando a la base de datos:', err.message);
  });

module.exports = pool;