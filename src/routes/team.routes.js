// src/routes/team.routes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller'); 
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); 

// Rutas para la gestión de equipos
// POST /api/teams - Crear un nuevo equipo (Solo admin)
router.post('/', verifyToken, isAdmin, teamController.createTeam);

// GET /api/teams - Obtener todos los equipos (Logueado)
router.get('/',  verifyToken, teamController.getAllTeams);

// GET /api/teams/:id - Obtener un equipo por ID (Logueado)
router.get('/:id', verifyToken, teamController.getTeamById);

// PUT /api/teams/:id - Actualizar un equipo por ID (Solo admin)
router.put('/:id', verifyToken, isAdmin, teamController.updateTeam);

// DELETE /api/teams/:id - Eliminar un equipo por ID (Solo admin)
router.delete('/:id', verifyToken, isAdmin, teamController.deleteTeam);

module.exports = router;