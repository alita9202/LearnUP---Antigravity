const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'learnup_super_secret_key';

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const [users] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = users[0];

    if (user.estado !== 'ACTIVO') {
      return res.status(403).json({ message: `Tu cuenta está ${user.estado.toLowerCase()}` });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, role: user.rol, name: user.nombre },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      message: 'Autenticación exitosa', 
      token, 
      user: { id: user.id, name: user.nombre, role: user.rol, email: user.email } 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Registrar un usuario (CLIENTE)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verificar si existe
    const [existing] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password_hash, rol, estado) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'CLIENTE', 'ACTIVO']
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { login, register };
