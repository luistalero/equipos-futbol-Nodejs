const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Position = sequelize.define('Position', {
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
  }
}, {
  tableName: 'positions',
  timestamps: false // No necesitamos timestamps para un catálogo simple
});

module.exports = Position;