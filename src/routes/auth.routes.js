// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller'); // Importa el controlador de autenticación
const { verifyToken } = require('../middlewares/auth.middleware'); // Importa el middleware de verificación de token

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para obtener el perfil del usuario autenticado (ejemplo de ruta protegida)
router.get('/profile', verifyToken, (req, res) => {
  // Si verifyToken pasa, req.userId y req.userRole estarán disponibles
  res.status(200).json({
    message: 'Acceso autorizado al perfil.',
    userId: req.userId,
    userRole: req.userRole
  });
});

module.exports = router;