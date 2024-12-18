const { DataTypes } = require('sequelize');
const Database = require('../config/database');

const sequelize = Database.getConnection();

const Cita = sequelize.define('Cita', {
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    pacienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sede: {
        type: DataTypes.STRING,
        allowNull: true, // Permitir valores nulos
    },
    tipoSeguro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metodoPago: {
        type: DataTypes.STRING, // Ejemplo: 'pago_online', 'pago_dia_cita'
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'pendiente', // Ejemplo: 'pendiente', 'confirmada', 'cancelada'
    },
});

module.exports = Cita;
