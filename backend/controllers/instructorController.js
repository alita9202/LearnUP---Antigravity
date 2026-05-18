const db = require('../config/db');

const applyToBeInstructor = async (req, res) => {
  try {
    const { 
      name, email, phone, city, dob, 
      specialties, experience, bio, 
      social_links, desired_courses, price_range 
    } = req.body;

    // Verificar si ya es usuario COLABORADOR o ADMIN
    const [existingUser] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      if (existingUser[0].rol === 'COLABORADOR' || existingUser[0].rol === 'ADMINISTRADOR') {
        return res.status(400).json({ message: 'Ya tienes una cuenta con privilegios de instructor o administrador.' });
      }
    }

    // Verificar si ya tiene una solicitud PENDIENTE
    const [existingRequest] = await db.execute(
      'SELECT id FROM solicitudes_colaborador WHERE email = ? AND estado = "PENDIENTE"',
      [email]
    );

    if (existingRequest.length > 0) {
      return res.status(400).json({ message: 'Ya tienes una solicitud pendiente de revisión.' });
    }

    // Insertar solicitud
    const [result] = await db.execute(
      `INSERT INTO solicitudes_colaborador 
        (nombre, email, telefono, especialidad, experiencia, descripcion, fecha_nacimiento, redes_sociales, cursos_deseados, rango_precios, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "PENDIENTE")`,
      [
        name, email, phone || '', specialties || '', experience || '', bio || '', 
        dob || null, social_links || '', desired_courses || '', price_range || ''
      ]
    );

    const solicitudId = result.insertId;

    // Guardar rutas de archivos si existen
    if (req.files) {
      const fileTypes = {
        cv: 'CV',
        photo: 'FOTO',
        id_doc: 'IDENTIFICACION'
      };

      for (const [key, filesArray] of Object.entries(req.files)) {
        if (filesArray && filesArray.length > 0) {
          const file = filesArray[0];
          // Generar URL pública (asumiendo host en port 5000)
          const fileUrl = `/uploads/${file.filename}`;
          
          await db.execute(
            'INSERT INTO archivos_colaborador (solicitud_id, tipo_archivo, url_archivo) VALUES (?, ?, ?)',
            [solicitudId, fileTypes[key] || 'PORTAFOLIO', fileUrl]
          );
        }
      }
    }

    res.status(201).json({ message: 'Tu solicitud ha sido enviada exitosamente. Pronto nos pondremos en contacto contigo.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error procesando tu solicitud', error: error.message });
  }
};

module.exports = { applyToBeInstructor };
