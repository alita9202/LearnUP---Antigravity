USE learnup_db;

-- 1. Actualizar tabla inscripciones (Hacer usuario_id NULLABLE y añadir campos de invitado)
ALTER TABLE inscripciones 
MODIFY COLUMN usuario_id INT NULL,
ADD COLUMN nombre_invitado VARCHAR(150) NULL,
ADD COLUMN email_invitado VARCHAR(150) NULL,
ADD COLUMN telefono_invitado VARCHAR(20) NULL,
ADD COLUMN ciudad_invitado VARCHAR(100) NULL,
ADD COLUMN edad_invitado INT NULL,
ADD COLUMN observaciones TEXT NULL;

-- 2. Actualizar tabla solicitudes_colaborador (Añadir campos profesionales y de rechazo)
ALTER TABLE solicitudes_colaborador
ADD COLUMN fecha_nacimiento DATE NULL,
ADD COLUMN redes_sociales TEXT NULL,
ADD COLUMN cursos_deseados TEXT NULL,
ADD COLUMN rango_precios VARCHAR(100) NULL,
ADD COLUMN motivo_rechazo TEXT NULL;

-- 3. Crear tabla archivos_colaborador
CREATE TABLE IF NOT EXISTS archivos_colaborador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    tipo_archivo ENUM('CV', 'FOTO', 'IDENTIFICACION', 'PORTAFOLIO') NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_colaborador(id) ON DELETE CASCADE
);
