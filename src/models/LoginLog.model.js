'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class LoginLog extends Model {}
    LoginLog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        loginTime: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'LoginLog',
        tableName: 'login_logs',
        timestamps: false,
        underscored: true
    });
    return LoginLog;
};