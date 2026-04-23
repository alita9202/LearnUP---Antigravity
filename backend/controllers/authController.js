const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'learnup_super_secret_key';

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña (simulación temporal si las contraseñas no están encriptadas, pero usaremos bcrypt)
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // Para simplificar pruebas iniciales:
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Autenticación exitosa', 
      token, 
      user: { id: user.id, name: user.name, role: user.role, email: user.email } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Registrar un usuario (interesado normal)
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Verificar si existe
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    // Hash de la contraseña temporalmente evitado para facilitar debug, asumiendo db vacia
    // const hashedPassword = await bcrypt.hash(password, 10);
   const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'interesado', phone]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { login, register };
