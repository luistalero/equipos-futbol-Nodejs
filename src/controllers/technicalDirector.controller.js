const { TechnicalDirector, Team } = require('../models/associations');

const createTechnicalDirector = async (req, res) => {
  const { name, lastname, nationality, birth_date } = req.body;
  try {
    const newTD = await TechnicalDirector.create({ name, lastname, nationality, birth_date });
    res.status(201).json({
      message: 'Director Técnico creado exitosamente.',
      technicalDirector: newTD
    });
  } catch (error) {
    console.error('Error al crear Director Técnico:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear Director Técnico.' });
  }
};

const getAllTechnicalDirectors = async (req, res) => {
  try {
    const technicalDirectors = await TechnicalDirector.findAll({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'city']
      }]
    });
    res.status(200).json(technicalDirectors);
  } catch (error) {
    console.error('Error al obtener Directores Técnicos:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener Directores Técnicos.' });
  }
};

const getTechnicalDirectorById = async (req, res) => {
  const { id } = req.params;
  try {
    const technicalDirector = await TechnicalDirector.findByPk(id, {
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'city']
      }]
    });
    if (!technicalDirector) {
      return res.status(404).json({ message: 'Director Técnico no encontrado.' });
    }
    res.status(200).json(technicalDirector);
  } catch (error) {
    console.error('Error al obtener Director Técnico por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener Director Técnico.' });
  }
};

const updateTechnicalDirector = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, nationality, birth_date } = req.body;
  try {
    const technicalDirector = await TechnicalDirector.findByPk(id);
    if (!technicalDirector) {
      return res.status(404).json({ message: 'Director Técnico no encontrado.' });
    }

    technicalDirector.name = name || technicalDirector.name;
    technicalDirector.lastname = lastname || technicalDirector.lastname;
    technicalDirector.nationality = nationality || technicalDirector.nationality;
    technicalDirector.birth_date = birth_date || technicalDirector.birth_date;
    
    await technicalDirector.save();
    res.status(200).json({
      message: 'Director Técnico actualizado exitosamente.',
      technicalDirector: technicalDirector
    });
  } catch (error) {
    console.error('Error al actualizar Director Técnico:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar Director Técnico.' });
  }
};

const deleteTechnicalDirector = async (req, res) => {
  const { id } = req.params;
  try {
    const technicalDirector = await TechnicalDirector.findByPk(id);
    if (!technicalDirector) {
      return res.status(404).json({ message: 'Director Técnico no encontrado.' });
    }
    await technicalDirector.destroy();
    res.status(200).json({ message: 'Director Técnico eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar Director Técnico:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar Director Técnico.' });
  }
};

module.exports = {
  createTechnicalDirector,
  getAllTechnicalDirectors,
  getTechnicalDirectorById,
  updateTechnicalDirector,
  deleteTechnicalDirector
};