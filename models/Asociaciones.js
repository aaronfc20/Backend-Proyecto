const Cita = require('./Cita');
const User = require('./User');
const MedicoR = require('./Médico');
const Feedback = require('./feedback')(require('../config/database'), require('sequelize').DataTypes); // Cambiar aquí
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
