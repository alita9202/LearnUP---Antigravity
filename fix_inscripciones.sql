-- Script para sincronizar columnas faltantes en la tabla inscripciones
-- Ejecutar en la base de datos de Render/Aiven o local si tienes problemas de columnas.

-- 1. Agregar la columna de progreso (entero de 0 a 100)
ALTER TABLE inscripciones 
ADD COLUMN progreso INT DEFAULT 0;

-- 2. Agregar la fecha de finalización (para los certificados)
ALTER TABLE inscripciones 
ADD COLUMN fecha_finalizacion DATETIME NULL;

-- Nota: Si la columna ya existe en tu DB y esto lanza un error "Duplicate column name", 
-- puedes ignorar el error de forma segura.
