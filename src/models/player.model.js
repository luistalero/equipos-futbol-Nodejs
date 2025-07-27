const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Player = sequelize.define('Player', {
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
  birth_date: {
    type: DataTypes.DATEONLY, // Solo la fecha, sin hora
    allowNull: true
  },
  photo_url: { // URL o ruta a la imagen del jugador
    type: DataTypes.STRING,
    allowNull: true
  },
  is_technical_director: { // Para identificar si es un jugador o el DT
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
  // team_id y position_id se agregarán como asociaciones en associations.js
}, {
  tableName: 'players',
  timestamps: true
});

module.exports = Player;