// src/routes/team.routes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller'); // Importa el controlador de equipos
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); // Importa los middlewares de seguridad

// Rutas para la gestión de equipos
// POST /api/teams - Crear un nuevo equipo (Solo admin)
router.post('/', verifyToken, isAdmin, teamController.createTeam);

// GET /api/teams - Obtener todos los equipos (Público)
router.get('/', teamController.getAllTeams);

// GET /api/teams/:id - Obtener un equipo por ID (Público)
router.get('/:id', teamController.getTeamById);

// PUT /api/teams/:id - Actualizar un equipo por ID (Solo admin)
router.put('/:id', verifyToken, isAdmin, teamController.updateTeam);

// DELETE /api/teams/:id - Eliminar un equipo por ID (Solo admin)
router.delete('/:id', verifyToken, isAdmin, teamController.deleteTeam);

module.exports = router;