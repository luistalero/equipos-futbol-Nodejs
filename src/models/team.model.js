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
    allowNull: true
  },
  logo_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foundation_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'teams',
  timestamps: true
});

module.exports = Team;