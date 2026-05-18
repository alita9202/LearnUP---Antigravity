const db = require('./backend/config/db');

async function runMigration() {
  try {
    console.log("Comprobando columna telefono...");
    const [cols1] = await db.execute("SHOW COLUMNS FROM usuarios LIKE 'telefono'");
    if (cols1.length === 0) {
      console.log("Añadiendo columna telefono...");
      await db.execute("ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) DEFAULT NULL");
    } else {
      console.log("La columna telefono ya existe.");
    }

    console.log("Comprobando columna ciudad...");
    const [cols2] = await db.execute("SHOW COLUMNS FROM usuarios LIKE 'ciudad'");
    if (cols2.length === 0) {
      console.log("Añadiendo columna ciudad...");
      await db.execute("ALTER TABLE usuarios ADD COLUMN ciudad VARCHAR(100) DEFAULT NULL");
    } else {
      console.log("La columna ciudad ya existe.");
    }

    console.log("¡Migración completada exitosamente!");
  } catch (err) {
    console.error("Error en la migración:", err.message);
  } finally {
    process.exit();
  }
}

runMigration();
