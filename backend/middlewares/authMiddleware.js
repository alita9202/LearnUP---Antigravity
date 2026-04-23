const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'learnup_super_secret_key';

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  const token = bearerHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Formato de token inválido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    // Añadir información del usuario a la request
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
