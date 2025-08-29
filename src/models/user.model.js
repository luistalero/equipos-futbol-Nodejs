'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
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
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        photo_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true
    });
    return User;
};