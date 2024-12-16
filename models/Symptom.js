const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');

const Symptom = sequelize.define('Symptom', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    meal_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'meals',
            key: 'id',
        },
    },
    symptom_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    logged_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

module.exports = Symptom;
