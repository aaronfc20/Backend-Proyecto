const Cita = require('./Cita');
const User = require('./User');
const MedicoR = require('./Médico');

// Relación actualizada con Users
User.hasMany(Cita, { foreignKey: 'pacienteId', as: 'citas' });
Cita.belongsTo(User, { foreignKey: 'pacienteId', as: 'usuario' });

// Relación con médicos
MedicoR.hasMany(Cita, { foreignKey: 'doctorId', as: 'citas' });
Cita.belongsTo(MedicoR, { foreignKey: 'doctorId', as: 'medico' });

module.exports = { Cita, User, MedicoR };
