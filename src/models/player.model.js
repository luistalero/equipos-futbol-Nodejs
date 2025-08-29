'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Player extends Model {}
    Player.init({
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
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        photo_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        position_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'Player',
        tableName: 'players',
        timestamps: true
    });
    return Player;
};