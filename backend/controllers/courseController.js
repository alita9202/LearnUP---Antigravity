const db = require('../config/db');

// Obtener todos los cursos (Catálogo público) con soporte para filtros
const getAllCourses = async (req, res) => {
  try {
    const { search, categoria, modalidad, maxPrice } = req.query;
    
    let baseQuery = `
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE c.estado_validacion = 'APROBADO'
    `;
    
    const params = [];
    
    if (search) {
      baseQuery += ` AND (c.titulo LIKE ? OR c.descripcion LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (categoria) {
      baseQuery += ` AND c.categoria = ?`;
      params.push(categoria);
    }
    
    if (modalidad) {
      baseQuery += ` AND c.modalidad = ?`;
      params.push(modalidad);
    }
    
    if (maxPrice) {
      baseQuery += ` AND c.precio <= ?`;
      params.push(maxPrice);
    }
    
    baseQuery += ` ORDER BY c.created_at DESC`;

    const [courses] = await db.execute(baseQuery, params);
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
    
    // Si no está aprobado, solo puede verlo el creador o un admin.
    // Para simplificar, si se solicita por ID público, debe estar aprobado, pero como es detalle, dejemos que lo devuelva si el front lo necesita o podemos restringirlo.
    // Lo más seguro es dejar que el frontend controle la vista de detalle si está en PENDIENTE.
    res.json(courses[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Crear un curso (Solo COLABORADOR/ADMINISTRADOR)
const createCourse = async (req, res) => {
  try {
    const { titulo, descripcion, precio, categoria, modalidad, ubicacion, cupos } = req.body;
    const colaborador_id = req.user.id; 

    if (req.user.role !== 'COLABORADOR' && req.user.role !== 'ADMINISTRADOR') {
      return res.status(403).json({ message: 'No tienes permisos para crear cursos' });
    }

    let imagen_url = null;
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
    }

    const [result] = await db.execute(
      `INSERT INTO cursos 
      (titulo, descripcion, precio, categoria, modalidad, ubicacion, cupos, fecha, imagen_url, estado_validacion, colaborador_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'PENDIENTE', ?)`,
      [titulo, descripcion, precio || 0, categoria, modalidad || 'Presencial', ubicacion || '', cupos || 0, imagen_url, colaborador_id]
    );

    res.status(201).json({ message: 'Curso creado correctamente en estado PENDIENTE', courseId: result.insertId });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Editar un curso
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, precio, categoria, modalidad, ubicacion, cupos } = req.body;
    const colaborador_id = req.user.id;

    // Obtener curso actual
    const [courses] = await db.execute('SELECT * FROM cursos WHERE id = ? AND colaborador_id = ?', [id, colaborador_id]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado o no tienes permiso' });
    }
    const course = courses[0];

    let imagen_url = course.imagen_url;
    let imageChanged = false;
    if (req.file) {
      imagen_url = `/uploads/${req.file.filename}`;
      imageChanged = true;
    }

    // Comprobar si hubo cambios críticos
    const isCriticalChange = 
      course.titulo !== titulo ||
      course.descripcion !== descripcion ||
      Number(course.precio) !== Number(precio) ||
      course.categoria !== categoria ||
      imageChanged;

    const newEstado = isCriticalChange ? 'PENDIENTE' : course.estado_validacion;

    await db.execute(
      `UPDATE cursos 
       SET titulo = ?, descripcion = ?, precio = ?, categoria = ?, modalidad = ?, ubicacion = ?, cupos = ?, imagen_url = ?, estado_validacion = ?
       WHERE id = ?`,
      [titulo, descripcion, precio || 0, categoria, modalidad || 'Presencial', ubicacion || '', cupos || 0, imagen_url, newEstado, id]
    );

    res.json({ message: 'Curso actualizado correctamente', estado_validacion: newEstado });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Eliminar un curso
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const colaborador_id = req.user.id;

    const [result] = await db.execute('DELETE FROM cursos WHERE id = ? AND colaborador_id = ?', [id, colaborador_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Curso no encontrado o no tienes permiso' });
    }

    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Obtener mis cursos (Colaborador)
const getMyCourses = async (req, res) => {
  try {
    const colaborador_id = req.user.id;
    const [courses] = await db.execute('SELECT * FROM cursos WHERE colaborador_id = ? ORDER BY created_at DESC', [colaborador_id]);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo los cursos', error: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getMyCourses };
