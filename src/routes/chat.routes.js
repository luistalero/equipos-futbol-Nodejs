const express = require('express');
const axios = require('axios');
// Importamos la función 'verifyToken' usando desestructuración.
const { verifyToken } = require('../middlewares/auth.middleware');
const { Chat } = require('../models/associations');

const router = express.Router();

const N8N_WEBHOOK_URL = process.env.N8N_TEST_WEBHOOK_URL; 

// Ruta para obtener el historial de chat de un usuario
router.get('/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const chatHistory = await Chat.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(chatHistory);
  } catch (error) {
    console.error('Error al obtener el historial de chat:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.post('/send', verifyToken, async (req, res) => {
  const { userId, message } = req.body;

  try {
    await Chat.create({
      userId,
      text: message,
      sender: 'user',
    });

    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, {
      userId,
      message,
    });
    
    const n8nTextResponse = n8nResponse.data.response || 'No se recibió una respuesta de n8n.';

    await Chat.create({
      userId,
      text: n8nTextResponse,
      sender: 'n8n',
    });

    const updatedHistory = await Chat.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error('Error en la comunicación con n8n:', error.message);
    res.status(500).json({ error: 'Error al procesar el mensaje.' });
  }
});

module.exports = router;
