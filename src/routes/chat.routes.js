const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { getChatHistory, sendMessage } = require('../controllers/chat.controller');

const router = express.Router();

// Ruta para obtener el historial de chat de un usuario
router.get('/:userId', verifyToken, getChatHistory);

// Ruta para enviar un mensaje y recibir una respuesta de n8n
router.post('/send', verifyToken, sendMessage);

module.exports = router;
