'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class LoginLog extends Model {
        static associate(models) {
            // No se necesita ninguna asociación si solo guardas el username.
        }
    }
    LoginLog.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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