-- Migration: Add telefono and ciudad to usuarios

USE learnup_db;

DELIMITER //

CREATE PROCEDURE AddColumnsIfNotExists()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'learnup_db' 
        AND TABLE_NAME = 'usuarios' 
        AND COLUMN_NAME = 'telefono'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) DEFAULT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'learnup_db' 
        AND TABLE_NAME = 'usuarios' 
        AND COLUMN_NAME = 'ciudad'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN ciudad VARCHAR(100) DEFAULT NULL;
    END IF;
END //

DELIMITER ;

CALL AddColumnsIfNotExists();
DROP PROCEDURE AddColumnsIfNotExists;
