// src/routes/player.routes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); // Asumiendo que tienes estos middlewares

// Rutas para jugadores
router.post('/', verifyToken, isAdmin, playerController.createPlayer);
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.put('/:id', verifyToken, isAdmin, playerController.updatePlayer);
router.delete('/:id', verifyToken, isAdmin, playerController.deletePlayer);

module.exports = router;