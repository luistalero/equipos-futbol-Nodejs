// src/controllers/position.controller.js
const { Position } = require('../models/associations');

const createPosition = async (req, res) => {
  const { name } = req.body;
  try {
    const existingPosition = await Position.findOne({ where: { name } });
    if (existingPosition) {
      return res.status(409).json({ message: 'La posición ya existe.' });
    }
    const newPosition = await Position.create({ name });
    res.status(201).json({
      message: 'Posición creada exitosamente.',
      position: newPosition
    });
  } catch (error) {
    console.error('Error al crear posición:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear posición.' });
  }
};

const getAllPositions = async (req, res) => {
  try {
    const positions = await Position.findAll();
    res.status(200).json(positions);
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener posiciones.' });
  }
};

const getPositionById = async (req, res) => {
  const { id } = req.params;
  try {
    const position = await Position.findByPk(id);
    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada.' });
    }
    res.status(200).json(position);
  } catch (error) {
    console.error('Error al obtener posición por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener posición.' });
  }
};

const updatePosition = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const position = await Position.findByPk(id);
    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada.' });
    }
    position.name = name;
    await position.save();
    res.status(200).json({
      message: 'Posición actualizada exitosamente.',
      position: position
    });
  } catch (error) {
    console.error('Error al actualizar posición:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar posición.' });
  }
};

const deletePosition = async (req, res) => {
  const { id } = req.params;
  try {
    const position = await Position.findByPk(id);
    if (!position) {
      return res.status(404).json({ message: 'Posición no encontrada.' });
    }
    await position.destroy();
    res.status(200).json({ message: 'Posición eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar posición:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar posición.' });
  }
};

module.exports = {
  createPosition,
  getAllPositions,
  getPositionById,
  updatePosition,
  deletePosition
};