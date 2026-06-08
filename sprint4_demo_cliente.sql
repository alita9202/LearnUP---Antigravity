-- ============================================================
-- Sprint 4: Datos Demo - Panel Cliente
-- Script idempotente: usa INSERT IGNORE para no duplicar
-- ============================================================

-- 1. Asegurarse de que la tabla inscripciones existe
CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('EN CURSO', 'FINALIZADO') DEFAULT 'EN CURSO',
  progreso INT DEFAULT 0,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_inscripcion (curso_id, usuario_id)
);

-- 2. Obtener el ID del cliente demo (reemplaza si tu email es distinto)
-- Verificación previa: SELECT id, nombre, email, rol FROM usuarios WHERE email = 'cliente@learnup.com';

SET @cliente_id = (
  SELECT id FROM usuarios WHERE email = 'cliente@learnup.com' LIMIT 1
);

-- 3. Obtener IDs de 3 cursos aprobados disponibles
SET @curso1 = (SELECT id FROM cursos WHERE estado_validacion = 'APROBADO' ORDER BY id ASC  LIMIT 1 OFFSET 0);
SET @curso2 = (SELECT id FROM cursos WHERE estado_validacion = 'APROBADO' ORDER BY id ASC  LIMIT 1 OFFSET 1);
SET @curso3 = (SELECT id FROM cursos WHERE estado_validacion = 'APROBADO' ORDER BY id ASC  LIMIT 1 OFFSET 2);

-- 4. Insertar inscripciones (INSERT IGNORE evita duplicados si el script se ejecuta más de una vez)

-- Curso 1: EN CURSO, 35% progreso
INSERT IGNORE INTO inscripciones (curso_id, usuario_id, estado, progreso, fecha_inscripcion)
VALUES (@curso1, @cliente_id, 'EN CURSO', 35, NOW() - INTERVAL 20 DAY);

-- Curso 2: EN CURSO, 70% progreso
INSERT IGNORE INTO inscripciones (curso_id, usuario_id, estado, progreso, fecha_inscripcion)
VALUES (@curso2, @cliente_id, 'EN CURSO', 70, NOW() - INTERVAL 10 DAY);

-- Curso 3: FINALIZADO, 100% progreso (habilitará el certificado)
INSERT IGNORE INTO inscripciones (curso_id, usuario_id, estado, progreso, fecha_inscripcion)
VALUES (@curso3, @cliente_id, 'FINALIZADO', 100, NOW() - INTERVAL 2 DAY);

-- 5. Verificación final
SELECT
  i.id          AS inscripcion_id,
  u.email       AS cliente,
  c.titulo      AS curso,
  i.estado,
  i.progreso,
  i.fecha_inscripcion
FROM inscripciones i
JOIN usuarios u ON u.id = i.usuario_id
JOIN cursos    c ON c.id = i.curso_id
WHERE u.email = 'cliente@learnup.com'
ORDER BY i.fecha_inscripcion DESC;
