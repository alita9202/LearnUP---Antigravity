-- update_schema_sprint3.sql
-- Este script actualiza la base de datos para soportar el Sprint 3: Búsqueda, Solicitud y Confirmación.

CREATE TABLE IF NOT EXISTS solicitudes_curso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  cliente_id INT NULL, -- NULL si el usuario no está logueado (invitado)
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  mensaje TEXT,
  estado ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
  motivo_rechazo TEXT,
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
