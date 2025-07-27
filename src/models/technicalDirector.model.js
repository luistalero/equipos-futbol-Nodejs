// src/models/technicalDirector.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TechnicalDirector = sequelize.define('TechnicalDirector', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY, // Solo fecha (YYYY-MM-DD)
    allowNull: true
  },
  // La asociación con Team se manejará en associations.js
}, {
  tableName: 'technical_directors', // Nombre de la tabla en la base de datos
  timestamps: true // Habilita createdAt y updatedAt
});

module.exports = TechnicalDirector;