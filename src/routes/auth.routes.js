const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword); 

router.post('/logout', authController.logoutUser);

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado al perfil.',
    userId: req.userId,
    userRole: req.userRole
  });
});

module.exports = router;