const db = require('./backend/config/db');

async function test() {
  try {
    const [rows] = await db.execute("DESCRIBE usuarios");
    console.log("Tabla usuarios:");
    console.log(rows);
  } catch (err) {
    console.error("Error DESCRIBE usuarios:", err.message);
  }
  
  try {
    const [rows] = await db.execute("DESCRIBE users");
    console.log("Tabla users:");
    console.log(rows);
  } catch (err) {
    console.error("Error DESCRIBE users:", err.message);
  }
  process.exit();
}

test();
