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
    type: DataTypes.DATEONLY,
    allowNull: true
  },
}, {
  tableName: 'technical_directors',
  timestamps: true
});

module.exports = TechnicalDirector;