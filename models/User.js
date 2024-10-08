// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: true, // Sólo para usuarios
        unique: true
    },
    colegiatura: {
        type: DataTypes.STRING,
        allowNull: true, // Sólo para doctores
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'doctor'),
        allowNull: false
    }
});

module.exports = User;
