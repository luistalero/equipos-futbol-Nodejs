const { Team, Player, TechnicalDirector, Position } = require('../models/associations'); // Asegúrate de importar Player, TechnicalDirector y Position

const createTeam = async (req, res) => {
  const { name, city, logo_url, foundation_date, technical_director_id } = req.body; // Asegúrate de incluir foundation_date y technical_director_id si los estás enviando
  try {
    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return res.status(409).json({ message: 'El equipo con ese nombre ya existe.' });
    }
    const newTeam = await Team.create({ name, city, logo_url, foundation_date, technical_director_id }); // Incluye foundation_date y technical_director_id aquí
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
    const teams = await Team.findAll({
      include: [
        { model: TechnicalDirector, as: 'technicalDirector', attributes: ['id', 'name', 'lastname'] },]
    });
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener equipos.' });
  }
};

const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findByPk(id, {
      include: [
        {
          model: Player,
          as: 'players', 
          include: {
            model: Position,
            as: 'position',
            attributes: ['id', 'name']
          }
        },
        {
          model: TechnicalDirector,
          as: 'technicalDirector'
        }
      ]
    });

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
  const { name, city, logo_url, foundation_date, technical_director_id } = req.body; 
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
    team.foundation_date = foundation_date || team.foundation_date;
    team.technical_director_id = technical_director_id !== undefined ? technical_director_id : team.technical_director_id; // Actualiza el DT

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