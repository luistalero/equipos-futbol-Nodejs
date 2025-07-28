const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true // Puede ser nulo si no se especifica
  },
  logo_url: { // URL o ruta a la imagen del logo del equipo
    type: DataTypes.STRING,
    allowNull: true
  },
  foundation_date: { // <-- ¡NUEVA LÍNEA AÑADIDA!
    type: DataTypes.DATEONLY, // Para almacenar solo la fecha (YYYY-MM-DD)
    allowNull: true // Puede ser nulo si no se especifica
  }
  // technical_director_id se agregará como una asociación en associations.js
}, {
  tableName: 'teams',
  timestamps: true
});

module.exports = Team;