'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class MessageChat extends Model {}
    MessageChat.init({
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
        
        userEmail: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'MessageChat',
        tableName: 'messages_chat',
        timestamps: true,
        underscored: true
    });
    return MessageChat;
};
