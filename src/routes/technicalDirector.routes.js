const express = require('express');
const router = express.Router();
const technicalDirectorController = require('../controllers/technicalDirector.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, isAdmin, technicalDirectorController.createTechnicalDirector);

router.get('/', verifyToken, technicalDirectorController.getAllTechnicalDirectors);

router.get('/:id', verifyToken, technicalDirectorController.getTechnicalDirectorById);

router.put('/:id', verifyToken, isAdmin, technicalDirectorController.updateTechnicalDirector);

router.delete('/:id', verifyToken, isAdmin, technicalDirectorController.deleteTechnicalDirector);

module.exports = router;