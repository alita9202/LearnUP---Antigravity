const db = require('./config/db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    const password = await bcrypt.hash('123456', 10);
    const [user] = await db.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin Prueba', 'admin@learnup.com', password, 'admin']
    );

    const [instructor] = await db.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Ana Fotografía', 'ana@learnup.com', password, 'docente']
    );

    await db.execute(
      'INSERT IGNORE INTO courses (id, title, description, price, category, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 'Fotografía Urbana', 'Descubre cómo tomar las mejores fotos en Sucre', 150.00, 'Arte y Diseño', instructor.insertId || 2]
    );

    console.log("Database seeded correctly");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seed();
