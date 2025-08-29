'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TechnicalDirector extends Model {}
    TechnicalDirector.init({
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
        photo_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'TechnicalDirector',
        tableName: 'technical_directors',
        timestamps: true
    });
    return TechnicalDirector;
};