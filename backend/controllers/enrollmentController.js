const db = require('../config/db');

// Inscribirse o Checkout
const checkout = async (req, res) => {
  try {
    const { coursesIds, user } = req.body; 
    // user puede tener { id: X } si está logueado, o { name, email, phone... } si es invitado

    if (!coursesIds || coursesIds.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    let userId = null;
    let isGuest = false;
    let guestData = {};

    if (user && user.id) {
      userId = user.id; // Alumno registrado
    } else {
      isGuest = true;
      guestData = {
        nombre: user.name,
        email: user.email,
        telefono: user.phone || '',
        ciudad: user.city || '',
        edad: user.age || null,
        observaciones: user.observations || ''
      };

      // Opcional: Podríamos crear un usuario automático aquí, pero el requerimiento 
      // indica relacionar directamente la inscripción o dejar temporal.
      // Si decidimos crearlo para que ya pueda loguearse después (con pass temporal):
      // const tempPass = await bcrypt.hash('123456', 10);
      // let [newUser] = await db.execute('INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, "CLIENTE")', [guestData.nombre, guestData.email, tempPass]);
      // userId = newUser.insertId;
      // Pero por requerimiento estricto, guardaremos la inscripción directamente con guest data en la tabla.
    }

    // Guardar las inscripciones
    for (const courseId of coursesIds) {
      // Evitar duplicados si es usuario registrado
      if (userId) {
        const [existing] = await db.execute('SELECT id FROM inscripciones WHERE usuario_id = ? AND curso_id = ?', [userId, courseId]);
        if (existing.length > 0) continue;
      }

      await db.execute(
        `INSERT INTO inscripciones (usuario_id, curso_id, nombre_invitado, email_invitado, telefono_invitado, ciudad_invitado, edad_invitado, observaciones, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
        [
          userId, 
          courseId, 
          isGuest ? guestData.nombre : null, 
          isGuest ? guestData.email : null, 
          isGuest ? guestData.telefono : null, 
          isGuest ? guestData.ciudad : null, 
          isGuest ? guestData.edad : null, 
          isGuest ? guestData.observaciones : null
        ]
      );
    }

    res.status(201).json({ message: 'Inscripción(es) procesada(s) con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error procesando la inscripción', error: error.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const [enrollments] = await db.execute(`
      SELECT c.*, i.estado as estado_inscripcion, i.fecha_inscripcion 
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.id
      WHERE i.usuario_id = ?
    `, [userId]);

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo inscripciones', error: error.message });
  }
};

module.exports = { checkout, getMyEnrollments };