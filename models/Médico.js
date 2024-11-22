const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medico = sequelize.define('Medico', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidoPaterno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidoMaterno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    consultorio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Medico;
