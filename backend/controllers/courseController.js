const db = require('../config/db');

// Obtener todos los cursos (Catálogo público)
const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE c.estado = 'ACTIVO'
    `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los cursos', error: error.message });
  }
};

// Obtener detalles de un curso específico
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [courses] = await db.execute(`
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE c.id = ?
    `, [id]);
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    res.json(courses[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Crear un curso (Solo COLABORADOR/ADMINISTRADOR)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, location, modalidad, cupos, imagen } = req.body;
    const colaborador_id = req.user.id; 

    if (req.user.role !== 'COLABORADOR' && req.user.role !== 'ADMINISTRADOR') {
      return res.status(403).json({ message: 'No tienes permisos para crear cursos' });
    }

    const [result] = await db.execute(
      'INSERT INTO cursos (titulo, descripcion, categoria, precio, fecha, modalidad, ubicacion, cupos, imagen, estado, colaborador_id) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)',
      [title, description, category, price || 0, modalidad || 'Presencial', location || 'Sucre', cupos || 0, imagen || null, 'ACTIVO', colaborador_id]
    );

    res.status(201).json({ message: 'Curso creado', courseId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse };
