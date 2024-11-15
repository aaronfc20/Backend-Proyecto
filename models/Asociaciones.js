// models/associations.js
const Cita = require('./Cita');
const Patient = require('./Patient');
const Medico = require('./Medico');

// Configurar las asociaciones
Patient.hasMany(Cita, { foreignKey: 'pacienteId', as: 'citas' });
Cita.belongsTo(Patient, { foreignKey: 'pacienteId', as: 'paciente' });

Medico.hasMany(Cita, { foreignKey: 'doctorId', as: 'citas' });
Cita.belongsTo(Medico, { foreignKey: 'doctorId', as: 'medico' });

// Exportar para asegurarse de que las asociaciones estén configuradas
module.exports = { Cita, Patient, Medico };
