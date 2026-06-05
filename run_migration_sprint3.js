const db = require('./backend/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'update_schema_sprint3.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log("Ejecutando update_schema_sprint3.sql...");
    
    // Split by semicolons for multiple statements
    const statements = sqlScript.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        await db.execute(stmt);
      }
    }
    
    console.log("¡Migración Sprint 3 completada exitosamente!");
  } catch (err) {
    console.error("Error en la migración:", err.message);
  } finally {
    process.exit();
  }
}

runMigration();
