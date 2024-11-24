const { DataTypes } = require('sequelize');
const Database = require('../config/database'); // Importa el Singleton

const sequelize = Database.getConnection(); // Obtén la conexión desde el Singleton

const Patient = sequelize.define('Patient', {
    nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    correoElectronico: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    doctor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    treatment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

module.exports = Patient;
