const Database = require('../config/database'); // Importa el Singleton
const sequelize = Database.getConnection(); // Obtén la conexión
const { DataTypes } = require('sequelize');

// Inicialización de modelos
const Cita = require('./Cita'); // Si este modelo ya está inicializado directamente, no se necesita inicializar aquí.
const User = require('./User');
const MedicoR = require('./Médico');
const Feedback = require('./feedback')(sequelize, DataTypes); // Inicializa Feedback con sequelize y DataTypes
const Patient = require('./patient')

// Relación entre User y Cita
User.hasMany(Cita, { foreignKey: 'pacienteId', as: 'citas' });
Cita.belongsTo(User, { foreignKey: 'pacienteId', as: 'usuario' });

// Relación entre MedicoR y Cita
MedicoR.hasMany(Cita, { foreignKey: 'doctorId', as: 'citas' });
Cita.belongsTo(MedicoR, { foreignKey: 'doctorId', as: 'medico' });

// Relación entre Feedback y Cita
Cita.hasMany(Feedback, { foreignKey: 'citaId', as: 'feedbacks', onDelete: 'CASCADE' });
Feedback.belongsTo(Cita, { foreignKey: 'citaId', as: 'cita', onDelete: 'CASCADE' });

module.exports = { Cita, User, MedicoR, Feedback, Patient };
