const bcrypt = require('bcryptjs');
const { User } = require('../models/associations');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, lastname, username, email, password, role, photo_url } = req.body;

    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
      role,
      photo_url
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, username, email, password, role, photo_url } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(password, salt);
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

exports.updateUserStrikes = async (req, res) => {
  const { userId, strikes, is_suspended } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.strikes = strikes;
    user.is_suspended = is_suspended;
    await user.save();

    res.status(200).json({ 
      message: 'Infracciones de usuario actualizadas exitosamente',
      user: { id: user.id, strikes: user.strikes, is_suspended: user.is_suspended }
    });

  } catch (error) {
      console.error('Error al actualizar las infracciones del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getUserStatus = async (req, res) => {
  const { id } = req.params;
  const authUserId = req.user.id;

  if (parseInt(id) !== authUserId) {
    return res.status(403).json({ message: 'Acceso no autorizado' });
  }

  try {
    const user = await User.findByPk(id, {
      attributes: ['is_suspended']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ is_suspended: user.is_suspended });

  } catch (error) {
      console.error('Error al obtener el estado del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
      return res.status(400).json({ message: 'El parámetro email es requerido.' });
  }

  try {
      const user = await User.findOne({
          where: { email },
          attributes: ['id', 'strikes', 'is_suspended']
      });

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json(user);

  } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
};