'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Team extends Model {}
    Team.init({
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
        sequelize,
        modelName: 'Team',
        tableName: 'teams',
        timestamps: true
    });
    return Team;
};