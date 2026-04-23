const db = require('../config/db');
const bcrypt = require('bcrypt');

const processCheckout = async (req, res) => {
  try {
    // Soportar diferentes nombres que puede mandar el frontend
    const coursesIds = req.body.coursesIds || req.body.cartItems?.map(c => c.id);
    const userData = req.body.user || req.body.userData;

    let userId = null;

    // ----------------------------
    // CASO 1: Usuario autenticado
    // ----------------------------
    if (userData && userData.id) {
      const [existingUser] = await db.execute(
        'SELECT id FROM users WHERE id = ?',
        [userData.id]
      );

      if (existingUser.length === 0) {
        return res.status(404).json({
          message: 'Usuario autenticado no encontrado en la base de datos.'
        });
      }

      userId = userData.id;
    }

    // ----------------------------
    // CASO 2: Usuario nuevo (checkout)
    // ----------------------------
    else if (userData && userData.email) {
      const [existing] = await db.execute(
        'SELECT id FROM users WHERE email = ?',
        [userData.email]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          message: 'El correo ya está registrado. Inicia sesión primero.'
        });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const [resultUser] = await db.execute(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, "interesado", ?)',
        [userData.name, userData.email, hashedPassword, userData.phone]
      );

      userId = resultUser.insertId;
    }

    // ----------------------------
    // ERROR: faltan datos
    // ----------------------------
    else {
      return res.status(400).json({
        message: 'Faltan datos de usuario para el registro.'
      });
    }

    // ----------------------------
    // VALIDAR CARRITO
    // ----------------------------
    if (!coursesIds || coursesIds.length === 0) {
      return res.status(400).json({
        message: 'El carrito no contiene cursos válidos.'
      });
    }

    // ----------------------------
    // TRANSACCIÓN
    // ----------------------------
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const courseId of coursesIds) {
        const [enrolled] = await connection.execute(
          'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
          [userId, courseId]
        );

        if (enrolled.length === 0) {
          await connection.execute(
            'INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, "pendiente")',
            [userId, courseId]
          );
        }
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        message: 'Inscripción procesada correctamente. Nos pondremos en contacto contigo.',
        userId: userId
      });

    } catch (txError) {
      await connection.rollback();
      connection.release();
      throw txError;
    }

  } catch (error) {
    console.error('❌ Error en checkout:', error);
    res.status(500).json({
      message: 'Error procesando la transacción',
      error: error.message
    });
  }
};

module.exports = { processCheckout };