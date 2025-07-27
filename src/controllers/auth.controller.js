// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations'); // Importa el modelo User
const jwtConfig = require('../config/jwt'); // Importa la configuración JWT

// Controlador para el registro de usuarios
const register = async (req, res) => {
  const { username, password, role } = req.body; // El rol es opcional, si no se envía, será 'user'

  try {
    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // SaltRounds = 10

    // 3. Crear el nuevo usuario en la base de datos
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'user' // Asigna el rol, por defecto 'user'
    });

    // 4. Generar un token JWT para el nuevo usuario (opcional, pero útil para inicio de sesión inmediato)
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      userId: newUser.id,
      username: newUser.username,
      token: token
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
  }
};

// Controlador para el inicio de sesión de usuarios
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Buscar el usuario por nombre de usuario
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparar la contraseña proporcionada con la contraseña hasheada
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Generar un token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Payload del token: id y rol del usuario
      jwtConfig.secret,               // Secreto para firmar el token
      { expiresIn: jwtConfig.expiresIn } // Tiempo de expiración
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token: token,
      userId: user.id,
      username: user.username,
      role: user.role
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
  }
};

module.exports = {
  register,
  login
};