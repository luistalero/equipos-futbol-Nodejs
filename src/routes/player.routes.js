const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, isAdmin, playerController.createPlayer);
router.get('/', verifyToken, playerController.getAllPlayers);
router.get('/:id', verifyToken, playerController.getPlayerById);
router.put('/:id', verifyToken, isAdmin, playerController.updatePlayer);
router.delete('/:id', verifyToken, isAdmin, playerController.deletePlayer);

module.exports = router;