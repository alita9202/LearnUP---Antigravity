-- update_schema_sprint2.sql
-- Este script prepara la base de datos Aiven MySQL para los requerimientos del Sprint 2.

-- 1. Si la tabla cursos no existe, se crea con todos los campos requeridos.
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  precio DECIMAL(10, 2) NOT NULL,
  modalidad VARCHAR(50),
  ubicacion VARCHAR(200),
  cupos INT NOT NULL,
  fecha DATETIME,
  imagen_url VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'ACTIVO', 
  estado_validacion ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
  motivo_rechazo TEXT,
  colaborador_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (colaborador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 2. (Opcional si la tabla ya existía de versiones anteriores)
-- Si la tabla 'cursos' ya existía pero le faltaban los campos del Sprint 2, 
-- se ejecutarían las siguientes sentencias (comentadas por seguridad, usar si es necesario):

-- ALTER TABLE cursos ADD COLUMN imagen_url VARCHAR(255) DEFAULT NULL;
-- ALTER TABLE cursos ADD COLUMN estado_validacion ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE';
-- ALTER TABLE cursos ADD COLUMN motivo_rechazo TEXT DEFAULT NULL;

-- 3. Tabla de inscripciones (Opcional, preparativo futuro, relacionada a cursos)
CREATE TABLE IF NOT EXISTS inscripciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  usuario_id INT NOT NULL,
  estado ENUM('ACTIVA', 'CANCELADA') DEFAULT 'ACTIVA',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
