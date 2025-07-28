// src/routes/position.routes.js
const express = require('express');
const router = express.Router();
const positionController = require('../controllers/position.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, isAdmin, positionController.createPosition);
router.get('/', verifyToken, positionController.getAllPositions);
router.get('/:id', verifyToken, positionController.getPositionById);
router.put('/:id', verifyToken, isAdmin, positionController.updatePosition);
router.delete('/:id', verifyToken, isAdmin, positionController.deletePosition);

module.exports = router;