// models/Cita.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
  nombreCompleto: { type: DataTypes.STRING, allowNull: false },
  motivo: { type: DataTypes.STRING, allowNull: false },
  hora: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Cita;