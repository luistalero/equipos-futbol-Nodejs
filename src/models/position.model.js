'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Position extends Model {}
    Position.init({
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
        sequelize,
        modelName: 'Position',
        tableName: 'positions',
        timestamps: false
    });
    return Position;
};