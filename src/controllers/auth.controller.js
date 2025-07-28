const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations'); 
const jwtConfig = require('../config/jwt'); 

const register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'user' 
    });

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

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      jwtConfig.secret,             
      { expiresIn: jwtConfig.expiresIn }
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