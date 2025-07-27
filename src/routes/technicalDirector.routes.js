// src/routes/technicalDirector.routes.js
const express = require('express');
const router = express.Router();
const technicalDirectorController = require('../controllers/technicalDirector.controller'); // Importa el controlador
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); // Importa los middlewares de seguridad

// Rutas para la gestión de Directores Técnicos
// POST /api/technical-directors - Crear un nuevo DT (Solo admin)
router.post('/', verifyToken, isAdmin, technicalDirectorController.createTechnicalDirector);

// GET /api/technical-directors - Obtener todos los DTs (Público)
router.get('/', technicalDirectorController.getAllTechnicalDirectors);

// GET /api/technical-directors/:id - Obtener un DT por ID (Público)
router.get('/:id', technicalDirectorController.getTechnicalDirectorById);

// PUT /api/technical-directors/:id - Actualizar un DT por ID (Solo admin)
router.put('/:id', verifyToken, isAdmin, technicalDirectorController.updateTechnicalDirector);

// DELETE /api/technical-directors/:id - Eliminar un DT por ID (Solo admin)
router.delete('/:id', verifyToken, isAdmin, technicalDirectorController.deleteTechnicalDirector);

module.exports = router;