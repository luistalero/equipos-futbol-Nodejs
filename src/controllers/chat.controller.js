const { Chat } = require('../models/associations');
const axios = require('axios');

const N8N_WEBHOOK_URL = process.env.URL_N8N_PRODUCTION || process.env.URL_N8N_TEST_PRODUCTION;

/**
 * Obtiene el historial de chat de un usuario específico.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const getChatHistory = async (req, res) => {
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
};

/**
 * Procesa un mensaje de usuario, lo guarda en la DB, lo envía a n8n
 * y guarda la respuesta de n8n.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // Guarda el mensaje del usuario en la base de datos
    await Chat.create({
      userId,
      text: message,
      sender: 'user',
    });

    // Envía el mensaje a n8n
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, {
      userId,
      message,
    });
    
    const n8nTextResponse = n8nResponse.data.response || 'No se recibió una respuesta de n8n.';

    // Guarda la respuesta de n8n en la base de datos
    await Chat.create({
      userId,
      text: n8nTextResponse,
      sender: 'n8n',
    });

    // Envía el historial actualizado como respuesta
    const updatedHistory = await Chat.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error('Error en la comunicación con n8n:', error.message);
    res.status(500).json({ error: 'Error al procesar el mensaje.' });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
};
