const db = require('../config/db');
const bcrypt = require('bcrypt');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.execute("SELECT COUNT(*) as totalUsers FROM usuarios");
    const [[{ totalCourses }]] = await db.execute("SELECT COUNT(*) as totalCourses FROM cursos WHERE estado = 'ACTIVO'");
    const [[{ pendingRequests }]] = await db.execute("SELECT COUNT(*) as pendingRequests FROM solicitudes_colaborador WHERE estado = 'PENDIENTE'");

    res.json({
      totalUsers,
      totalCourses,
      pendingRequests,
      revenue: 0 // Simulado para futuro
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo estadísticas', error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const [requests] = await db.execute("SELECT * FROM solicitudes_colaborador ORDER BY fecha_solicitud DESC");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo solicitudes', error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener solicitud
    const [requests] = await db.execute("SELECT * FROM solicitudes_colaborador WHERE id = ?", [id]);
    if (requests.length === 0) return res.status(404).json({ message: 'Solicitud no encontrada' });
    
    const request = requests[0];
    if (request.estado !== 'PENDIENTE') return res.status(400).json({ message: 'La solicitud ya fue procesada' });

    // Generar contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Verificar si el email ya existe en usuarios
    const [users] = await db.execute("SELECT id FROM usuarios WHERE email = ?", [request.email]);
    if (users.length > 0) {
      // Actualizar a colaborador
      await db.execute("UPDATE usuarios SET rol = 'COLABORADOR', password_hash = ? WHERE email = ?", [hashedPassword, request.email]);
    } else {
      // Crear nuevo usuario colaborador
      await db.execute(
        "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, 'COLABORADOR')",
        [request.nombre, request.email, hashedPassword]
      );
    }

    // Actualizar solicitud a APROBADO
    await db.execute("UPDATE solicitudes_colaborador SET estado = 'APROBADO', fecha_respuesta = NOW() WHERE id = ?", [id]);

    // Simulación de envío de correo
    console.log(`\n📧 [SIMULADOR DE EMAIL] \nPara: ${request.email}\nAsunto: Solicitud Aprobada\n¡Felicidades ${request.nombre}! Tu solicitud ha sido aprobada. \nTu contraseña temporal es: ${tempPassword}\nPor favor, cámbiala al iniciar sesión.\n`);

    res.json({ message: 'Solicitud aprobada y usuario creado', tempPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error aprobando solicitud', error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("UPDATE solicitudes_colaborador SET estado = 'RECHAZADO', fecha_respuesta = NOW() WHERE id = ?", [id]);
    res.json({ message: 'Solicitud rechazada' });
  } catch (error) {
    res.status(500).json({ message: 'Error rechazando solicitud', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const [users] = await db.execute("SELECT id, nombre, email, rol, estado, telefono, ciudad, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuarios', error: error.message });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // ACTIVO, SUSPENDIDO
    await db.execute("UPDATE usuarios SET estado = ? WHERE id = ?", [estado, id]);
    res.json({ message: `Usuario ${estado.toLowerCase()}` });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol, estado, telefono, ciudad } = req.body;
    
    // Check if email exists
    const [existing] = await db.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'El email ya está registrado' });

    if (!password || password.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(
      "INSERT INTO usuarios (nombre, email, password_hash, rol, estado, telefono, ciudad) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || 'CLIENTE', estado || 'ACTIVO', telefono || null, ciudad || null]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error creando usuario', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol, estado, telefono, ciudad } = req.body;

    // Check if user exists
    const [users] = await db.execute("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (users.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Check email conflict
    const [existing] = await db.execute("SELECT id FROM usuarios WHERE email = ? AND id != ?", [email, id]);
    if (existing.length > 0) return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });

    let updateQuery = "UPDATE usuarios SET nombre = ?, email = ?, rol = ?, estado = ?, telefono = ?, ciudad = ? WHERE id = ?";
    let queryParams = [nombre, email, rol, estado, telefono || null, ciudad || null, id];

    if (password) {
      if (password.length < 6) return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = "UPDATE usuarios SET nombre = ?, email = ?, password_hash = ?, rol = ?, estado = ?, telefono = ?, ciudad = ? WHERE id = ?";
      queryParams = [nombre, email, hashedPassword, rol, estado, telefono || null, ciudad || null, id];
    }

    await db.execute(updateQuery, queryParams);
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando usuario', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.id == id) {
      return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    const [result] = await db.execute("DELETE FROM usuarios WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando usuario', error: error.message });
  }
};

const getPendingCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      WHERE c.estado_validacion = 'PENDIENTE'
      ORDER BY c.id ASC
    `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo cursos pendientes', error: error.message });
  }
};

const getAllAdminCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, u.nombre as instructor_name 
      FROM cursos c
      JOIN usuarios u ON c.colaborador_id = u.id
      ORDER BY c.fecha DESC
    `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo cursos', error: error.message });
  }
};

const validateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_validacion, motivo_rechazo } = req.body;
    
    if (estado_validacion !== 'APROBADO' && estado_validacion !== 'RECHAZADO') {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    await db.execute(
      "UPDATE cursos SET estado_validacion = ?, motivo_rechazo = ? WHERE id = ?",
      [estado_validacion, motivo_rechazo || null, id]
    );

    res.json({ message: `Curso ${estado_validacion.toLowerCase()} correctamente` });
  } catch (error) {
    res.status(500).json({ message: 'Error validando curso', error: error.message });
  }
};

module.exports = { 
  getDashboardStats, 
  getRequests, 
  approveRequest, 
  rejectRequest, 
  getUsers, 
  toggleUserStatus,
  createUser,
  updateUser,
  deleteUser,
  getPendingCourses,
  getAllAdminCourses,
  validateCourse
};
