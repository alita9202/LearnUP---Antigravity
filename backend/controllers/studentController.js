const db = require('../config/db');

const getStudentDashboard = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    // Estadísticas
    const [[stats]] = await db.execute(`
      SELECT 
        COUNT(*) as total_inscritos,
        SUM(CASE WHEN estado = 'EN CURSO' THEN 1 ELSE 0 END) as en_curso,
        SUM(CASE WHEN estado = 'FINALIZADO' THEN 1 ELSE 0 END) as finalizados
      FROM inscripciones
      WHERE usuario_id = ?
    `, [usuario_id]);

    // Cursos Inscritos con JOIN a la tabla cursos y usuarios (para el nombre del instructor)
    const [enrolledCourses] = await db.execute(`
      SELECT 
        i.id as inscripcion_id, i.fecha_inscripcion, i.estado as estado_inscripcion,
        c.id as curso_id, c.titulo, c.descripcion, c.categoria, c.imagen_url, c.modalidad,
        u.nombre as instructor_name
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.id
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE i.usuario_id = ?
      ORDER BY i.fecha_inscripcion DESC
    `, [usuario_id]);

    res.json({
      stats: {
        total: stats.total_inscritos || 0,
        en_curso: stats.en_curso || 0,
        finalizados: stats.finalizados || 0,
        certificados: stats.finalizados || 0 // Por ahora 1 cert por curso finalizado
      },
      enrolledCourses: enrolledCourses.map(course => ({
        ...course,
        progreso: course.estado_inscripcion === 'FINALIZADO' ? 100 : (course.estado_inscripcion === 'EN CURSO' ? 50 : 0)
      }))
    });
  } catch (error) {
    console.error('Error obteniendo dashboard del estudiante:', error);
    res.status(500).json({ message: 'Error obteniendo dashboard', error: error.message });
  }
};

const getRecommendedCourses = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    // Cursos activos a los que NO está inscrito
    const [recommendations] = await db.execute(`
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE c.estado_validacion = 'APROBADO'
      AND c.id NOT IN (SELECT curso_id FROM inscripciones WHERE usuario_id = ?)
      ORDER BY c.fecha DESC
      LIMIT 4
    `, [usuario_id]);

    res.json(recommendations);
  } catch (error) {
    console.error('Error obteniendo recomendaciones:', error);
    res.status(500).json({ message: 'Error obteniendo recomendaciones', error: error.message });
  }
};

module.exports = {
  getStudentDashboard,
  getRecommendedCourses
};
