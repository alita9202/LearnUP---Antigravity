const db = require('../config/db');
const bcrypt = require('bcrypt');

const applyToBeInstructor = async (req, res) => {
  try {
    const { name, email, password, phone, experience, specialties, cv_reference } = req.body;

    // 1. Verificar si el correo ya existe
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    let userId;

    if (existing.length > 0) {
      // Si ya existe, usamos su ID. Si ya es docente, lo rechazamos o avisamos
      const user = existing[0];
      if (user.role === 'docente' || user.role === 'admin') {
        return res.status(400).json({ message: 'Ya tienes un rol con privilegios de instructor.' });
      }
      userId = user.id;
    } else {
      // 2. Si no existe, registrar el usuario básico
      const hashedPassword = await bcrypt.hash(password, 10);
      const [resultUser] = await db.execute(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, 'interesado', phone]
      );
      userId = resultUser.insertId;
    }

    // 3. Crear el Request en instructor_requests
    const applicationDetails = JSON.stringify({ experience, specialties, cv_reference });
    
    // Verificar que no haya ya una solicitud pendiente
    const [existingRequest] = await db.execute(
      'SELECT id FROM instructor_requests WHERE user_id = ? AND status = "pendiente"',
      [userId]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({ message: 'Ya tienes una solicitud pendiente de revisión.' });
    }

    await db.execute(
      'INSERT INTO instructor_requests (user_id, application_details) VALUES (?, ?)',
      [userId, applicationDetails]
    );

    res.status(201).json({ message: 'Postulación enviada correctamente. El administrador la revisará.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { applyToBeInstructor };
