const db = require('../config/db');

// Obtener todos los cursos (Catálogo público)
const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
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
      SELECT c.*, u.name as instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
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

// Crear un curso (Solo Docentes/Admins)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, location } = req.body;
    const instructor_id = req.user.id; // Asignado por middleware de Auth

    if (req.user.role !== 'docente' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para crear cursos' });
    }

    const [result] = await db.execute(
      'INSERT INTO courses (title, description, price, category, instructor_id, location) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, price, category, instructor_id, location]
    );

    res.status(201).json({ message: 'Curso creado', courseId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse };
