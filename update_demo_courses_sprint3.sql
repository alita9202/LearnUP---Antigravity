-- =========================================================================
-- SCRIPT DE INSERCIÓN DE DATOS DEMO - SPRINT 3
-- PROPÓSITO: Insertar 10 cursos/talleres realistas para probar catálogo
-- =========================================================================

-- 1. Obtener el ID del colaborador demo. 
-- Asumimos que existe un usuario con rol COLABORADOR (ej. colaborador@learnup.com)
SET @colab_email = 'colaborador@learnup.com';
SET @colab_id = (SELECT id FROM usuarios WHERE email = @colab_email LIMIT 1);

-- Fallback: Si no se encuentra, usamos el ID 2 (típico en la base de datos de pruebas)
SET @colab_id = IFNULL(@colab_id, 2);

-- 2. Insertar cursos de prueba
-- Todas las imágenes apuntan a URLs externas de Unsplash optimizadas (q=80, w=800)
INSERT INTO cursos (titulo, descripcion, categoria, precio, modalidad, ubicacion, cupos, imagen_url, estado_validacion, colaborador_id, fecha) VALUES 
('Maestría en Repostería Francesa', 'Aprende a preparar los mejores macarons, eclairs y croissants con técnicas auténticas de París.', 'Repostería', 150.00, 'Presencial', 'Zona Centro, Sucre', 15, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Desarrollo Web Full Stack con React', 'Curso intensivo para dominar el desarrollo web moderno utilizando React, Node.js y bases de datos SQL.', 'Tecnología', 300.00, 'Virtual', 'Online (Zoom)', 50, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Introducción a la Inteligencia Artificial', 'Descubre cómo utilizar herramientas de IA como ChatGPT y Midjourney para aumentar tu productividad.', 'Tecnología', 80.00, 'Híbrido', 'Auditorio USFX / Online', 30, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Acuarela para Principiantes', 'Explora tu creatividad con técnicas básicas de acuarela, mezcla de colores y texturas.', 'Arte', 90.00, 'Presencial', 'Taller de Arte Creativo', 12, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Marketing Digital en Redes Sociales', 'Estrategias comprobadas para crecer en Instagram y TikTok y convertir seguidores en clientes.', 'Marketing', 120.00, 'Virtual', 'Online (Google Meet)', 40, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Gastronomía Boliviana Moderna', 'Reinventa platos típicos con técnicas culinarias de vanguardia y emplatados profesionales.', 'Gastronomía', 180.00, 'Presencial', 'Escuela Gastronómica Sur', 20, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Inglés Conversacional Intermedio', 'Pierde el miedo a hablar. Prácticas 100% conversacionales con profesores nativos.', 'Idiomas', 200.00, 'Virtual', 'Online (Zoom)', 25, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Fotografía de Retrato en Exteriores', 'Domina la luz natural, la composición y la dirección de modelos en locaciones urbanas.', 'Fotografía', 110.00, 'Híbrido', 'Centro Histórico / Online', 15, 'https://images.unsplash.com/photo-1554046920-90dcac824bd6?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Educación Financiera Personal', 'Toma el control de tus finanzas, aprende a ahorrar, invertir y crear presupuesto mensual.', 'Educación', 50.00, 'Virtual', 'Online', 100, 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW()),
('Diseño de Interfaces UI/UX', 'Aprende Figma desde cero y diseña aplicaciones móviles y web con enfoque en la experiencia de usuario.', 'Arte', 160.00, 'Híbrido', 'Coworking Sucre / Online', 20, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800', 'APROBADO', @colab_id, NOW());

-- Mensaje de confirmación sugerido si se corre en consola:
-- SELECT '10 cursos insertados correctamente' AS 'Resultado';
