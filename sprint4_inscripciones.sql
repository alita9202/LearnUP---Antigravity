-- Script para el Sprint 4: Tabla de Inscripciones
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
