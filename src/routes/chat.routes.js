const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const { getChatHistory, sendMessage, receiveN8nResponse } = require('../controllers/chat.controller');

const router = express.Router();

// Ruta para obtener el historial de chat del usuario
router.get('/:userId', verifyToken, getChatHistory);

// Ruta para que el usuario envíe un mensaje al chatbot
router.post('/send', verifyToken, sendMessage);

// Nuevo endpoint para que n8n envíe su respuesta
router.post('/n8n-response', receiveN8nResponse);


module.exports = router;
