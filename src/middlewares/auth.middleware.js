// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt'); // Importa la configuración JWT

const verifyToken = (req, res, next) => {
  // Obtener el token del encabezado de la autorización
  // El formato esperado es 'Bearer TOKEN_AQUI'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: 'Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1]; // Divide "Bearer TOKEN" y toma el TOKEN

  if (!token) {
    return res.status(403).json({ message: 'Formato de token inválido. Se esperaba "Bearer <token>".' });
  }

  // Verificar el token
  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado.' });
      }
      return res.status(401).json({ message: 'Fallo al autenticar el token.' });
    }

    // Si el token es válido, guardar los datos decodificados en el objeto de solicitud
    // para que los controladores puedan acceder a ellos (ej. req.userId, req.userRole)
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next(); // Pasar al siguiente middleware o controlador
  });
};

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  // Asume que verifyToken ya ha guardado req.userRole
  if (req.userRole === 'admin') {
    next(); // Es admin, continúa
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};


module.exports = {
  verifyToken,
  isAdmin
};