const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/associations'); 
const jwtConfig = require('../config/jwt'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios');

const n8n_production_webhook_url = process.env.N8N_WEBHOOK_URL;
const n8n_test_webhook_url = process.env.N8N_TEST_WEBHOOK_URL;

const n8n_webhook_url = process.env.NODE_ENV === 'production'
  ? n8n_production_webhook_url
  : n8n_test_webhook_url || n8n_production_webhook_url;

const register = async (req, res) => {
  const { name, lastname, username, email, password, role } = req.body;
  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El nombre de usuario ya está en uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await User.create({
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: role || 'user' 
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const userToSend = {
      id: newUser.id,
      name: newUser.name,
      lastname: newUser.lastname,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    if (n8n_webhook_url) {
      axios.post(n8n_webhook_url, userToSend)
        .then(response => {
          console.log('✅ Webhook de nuevo usuario enviado a n8n con éxito. Estado:', response.status, 'url:', n8n_webhook_url);
        })
        .catch(error => {
          console.error('❌ Error al enviar webhook a n8n:', error.message, 'url:', n8n_webhook_url);
        });
    } else {
      console.log('⚠️ No se encontró la URL del webhook de n8n en el archivo .env. Webhook no enviado.');
    }

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

    const now = new Date();
    const loginTime = now.toLocaleString(); 

    const userToSend = {
      username: username,
      loginTime: loginTime
    };

    if (n8n_webhook_url) {
      axios.post(n8n_webhook_url, userToSend)
        .then(response => {
          console.log('✅ Webhook de nuevo usuario enviado a n8n con éxito. Estado:', response.status, 'url:', n8n_webhook_url);
        })
        .catch(error => {
          console.error('❌ Error al enviar webhook a n8n:', error.message, 'url:', n8n_webhook_url);
        });
    } else {
      console.log('⚠️ No se encontró la URL del webhook de n8n en el archivo .env. Webhook no enviado.');
    }


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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({ message: 'Si el correo electrónico existe, se ha enviado un enlace para restablecer la contraseña.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'luisalbertotaleromartinez@gmail.com',
        pass: 'ccraqtbxcqbikokb',
      },
    });

    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`; // URL del frontend

    const mailOptions = {
      to: user.email,
      from: 'luisalbertotaleromartinez@gmail.com',
      subject: 'Restablecimiento de Contraseña',
      html: `
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace es válido por 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email de recuperación enviado.' });
    
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [User.sequelize.Op.gt]: Date.now() } // Verifica si el token ha expirado
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword
};