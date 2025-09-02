'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Chat extends Model {}
    Chat.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sender: {
            type: DataTypes.ENUM('user', 'n8n'),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: true,
        underscored: true
    });
    return Chat;
};
