-- Actualización de esquema para LearnUp
-- Crea las nuevas tablas en español sin eliminar las tablas anteriores en inglés

USE learnup_db;

-- 1. Nueva tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR', 'COLABORADOR', 'CLIENTE') DEFAULT 'CLIENTE',
    estado ENUM('ACTIVO', 'PENDIENTE', 'SUSPENDIDO', 'RECHAZADO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Nueva tabla de solicitudes de colaborador
CREATE TABLE IF NOT EXISTS solicitudes_colaborador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    especialidad VARCHAR(150),
    experiencia TEXT,
    descripcion TEXT,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL DEFAULT NULL
);

-- 3. Nueva tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria VARCHAR(100),
    precio DECIMAL(10, 2) DEFAULT 0.00,
    fecha DATETIME,
    modalidad ENUM('Presencial', 'Virtual', 'Mixto') DEFAULT 'Presencial',
    ubicacion VARCHAR(200) DEFAULT 'Sucre',
    cupos INT DEFAULT 0,
    imagen TEXT,
    estado ENUM('ACTIVO', 'INACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    colaborador_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (colaborador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. Nueva tabla de inscripciones
CREATE TABLE IF NOT EXISTS inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADO', 'CANCELADO') DEFAULT 'PENDIENTE',
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Migración opcional de datos (Si hay datos en users que quieras pasar)
-- INSERT IGNORE INTO usuarios (id, nombre, email, password_hash, rol, fecha_creacion)
-- SELECT id, name, email, password, 
--   CASE WHEN role = 'admin' THEN 'ADMINISTRADOR' 
--        WHEN role = 'docente' THEN 'COLABORADOR' 
--        ELSE 'CLIENTE' END, 
--   created_at 
-- FROM users;
