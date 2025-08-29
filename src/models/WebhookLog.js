'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class WebhookLog extends Model {
        static associate(models) {
        }
    }
    WebhookLog.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        payload: {
            type: DataTypes.JSON,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        endpoint: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'WebhookLog',
        tableName: 'webhook_logs',
        timestamps: true,
        underscored: true
    });
    return WebhookLog;
};
