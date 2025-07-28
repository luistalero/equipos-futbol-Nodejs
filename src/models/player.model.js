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
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  photo_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_technical_director: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'players',
  timestamps: true
});

module.exports = Player;