const { Team } = require('../models/associations');

const createTeam = async (req, res) => {
  const { name, city, logo_url } = req.body;
  try {
    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return res.status(409).json({ message: 'El equipo con ese nombre ya existe.' });
    }
    const newTeam = await Team.create({ name, city, logo_url });
    res.status(201).json({
      message: 'Equipo creado exitosamente.',
      team: newTeam
    });
  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear equipo.' });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener equipos.' });
  }
};

const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }
    res.status(200).json(team);
  } catch (error) {
    console.error('Error al obtener equipo por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener equipo.' });
  }
};

const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, city, logo_url } = req.body;
  try {
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }
    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ where: { name } });
      if (existingTeam) {
        return res.status(409).json({ message: 'Ya existe otro equipo con ese nombre.' });
      }
    }

    team.name = name || team.name;
    team.city = city || team.city;
    team.logo_url = logo_url || team.logo_url;
    
    await team.save();
    res.status(200).json({
      message: 'Equipo actualizado exitosamente.',
      team: team
    });
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar equipo.' });
  }
};

const deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: 'Equipo no encontrado.' });
    }
    await team.destroy();
    res.status(200).json({ message: 'Equipo eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar equipo.' });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};