'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ChatMessage extends Model {}
    ChatMessage.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true 
        },
        
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'ChatMessage',
        tableName: 'chat_messages',
        timestamps: true,
        underscored: true
    });
    return ChatMessage;
};
