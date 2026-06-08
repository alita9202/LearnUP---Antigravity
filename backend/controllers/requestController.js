const db = require('../config/db');

// Crear una nueva solicitud
const createRequest = async (req, res) => {
  try {
    const { curso_id, cliente_id, nombre, email, telefono, ciudad, mensaje } = req.body;
    
    // Validar datos básicos
    if (!curso_id || !nombre || !email || !telefono || !ciudad) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar presentes' });
    }

    const [result] = await db.execute(
      `INSERT INTO solicitudes_curso 
       (curso_id, cliente_id, nombre, email, telefono, ciudad, mensaje, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
      [curso_id, cliente_id || null, nombre, email, telefono, ciudad, mensaje || null]
    );

    res.status(201).json({ message: 'Solicitud enviada correctamente', requestId: result.insertId });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ message: 'Error del servidor al crear solicitud', error: error.message });
  }
};

// Obtener solicitudes para el colaborador
const getRequestsByCollaborator = async (req, res) => {
  try {
    const colaborador_id = req.user.id;

    // Obtener solicitudes de los cursos que pertenecen al colaborador
    const [requests] = await db.execute(`
      SELECT s.*, c.titulo as curso_titulo
      FROM solicitudes_curso s
      JOIN cursos c ON s.curso_id = c.id
      WHERE c.colaborador_id = ?
      ORDER BY s.fecha_solicitud DESC
    `, [colaborador_id]);

    res.json(requests);
  } catch (error) {
    console.error('Error obteniendo solicitudes del colaborador:', error);
    res.status(500).json({ message: 'Error del servidor al obtener solicitudes', error: error.message });
  }
};

// Cambiar estado de la solicitud (Aceptar / Rechazar)
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, motivo_rechazo } = req.body;
    const colaborador_id = req.user.id;

    if (!['ACEPTADA', 'RECHAZADA'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    if (estado === 'RECHAZADA' && !motivo_rechazo) {
      return res.status(400).json({ message: 'Debes proporcionar un motivo de rechazo' });
    }

    // Verificar que la solicitud pertenece a un curso del colaborador
    const [requests] = await db.execute(`
      SELECT s.id, s.curso_id, s.cliente_id FROM solicitudes_curso s
      JOIN cursos c ON s.curso_id = c.id
      WHERE s.id = ? AND c.colaborador_id = ?
    `, [id, colaborador_id]);

    if (requests.length === 0) {
      return res.status(403).json({ message: 'No tienes permiso para modificar esta solicitud o no existe' });
    }

    const solicitud = requests[0];

    await db.execute(
      `UPDATE solicitudes_curso 
       SET estado = ?, motivo_rechazo = ?
       WHERE id = ?`,
      [estado, estado === 'RECHAZADA' ? motivo_rechazo : null, id]
    );

    // Crear inscripción automática si fue aceptada y tiene cliente_id
    if (estado === 'ACEPTADA' && solicitud.cliente_id) {
      try {
        await db.execute(
          `INSERT IGNORE INTO inscripciones (curso_id, usuario_id, estado, progreso) 
           VALUES (?, ?, 'EN CURSO', 0)`,
          [solicitud.curso_id, solicitud.cliente_id]
        );
      } catch (insertErr) {
        console.error('Error al insertar inscripción automática:', insertErr);
      }
    }

    res.json({ message: `Solicitud ${estado.toLowerCase()} correctamente` });
  } catch (error) {
    console.error('Error actualizando solicitud:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar solicitud', error: error.message });
  }
};

module.exports = { createRequest, getRequestsByCollaborator, updateRequestStatus };
