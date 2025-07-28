const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller'); 
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); 

router.post('/', verifyToken, isAdmin, teamController.createTeam);

router.get('/',  verifyToken, teamController.getAllTeams);

router.get('/:id', verifyToken, teamController.getTeamById);

router.put('/:id', verifyToken, isAdmin, teamController.updateTeam);

router.delete('/:id', verifyToken, isAdmin, teamController.deleteTeam);

module.exports = router;