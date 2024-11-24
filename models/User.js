// models/User.js
const { DataTypes } = require('sequelize');
const Database = require('../config/database');

const sequelize = Database.getConnection();

const User = sequelize.define('User', {
    dni: {
        type: DataTypes.STRING,
        allowNull: true, // DNI solo para usuarios
        unique: true
    },
    apellidoPaterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidoMaterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    numeroCelular: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genero: {
        type: DataTypes.ENUM('masculino', 'femenino'),
        allowNull: false
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
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
