const { Chat } = require('../models/associations');
const axios = require('axios');

const n8n_production_webhook_url = process.env.URL_N8N_PRODUCTION;
const n8n_test_webhook_url = process.env.URL_N8N_TEST_PRODUCTION;

const n8n_webhook_url = process.env.NODE_ENV === 'production'
  ? n8n_production_webhook_url
  : n8n_test_webhook_url || n8n_production_webhook_url;

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
 * Procesa un mensaje de usuario, lo guarda en la DB y lo envía a n8n.
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
    await axios.post(n8n_webhook_url, {
      userId,
      message,
    });

    // Envía una respuesta inmediata al frontend. La respuesta de n8n llegará por el nuevo endpoint
    res.status(200).json({ message: 'Mensaje enviado a n8n.' });
  } catch (error) {
    console.error('Error al comunicarse con n8n:', error.message);
    res.status(500).json({ error: 'Error al procesar el mensaje.' });
  }
};

/**
 * Nuevo endpoint para recibir la respuesta de n8n.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const receiveN8nResponse = async (req, res) => {
  const { userId, response } = req.body;

  if (!userId || !response) {
    return res.status(400).json({ error: 'Faltan parámetros: userId y response son requeridos.' });
  }

  try {
    await Chat.create({
      userId,
      text: response,
      sender: 'n8n',
    });
    // Aquí podrías emitir un mensaje via WebSocket si está configurado
    res.status(200).json({ message: 'Respuesta de n8n recibida y guardada.' });
  } catch (error) {
    console.error('Error al procesar la respuesta de n8n:', error.message);
    res.status(500).json({ error: 'Error al procesar la respuesta.' });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  receiveN8nResponse,
};
