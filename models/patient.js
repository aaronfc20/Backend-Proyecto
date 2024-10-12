const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    nombreCompleto: { type: String, required: true }, // Usar solo nombreCompleto
    dateOfBirth: { type: Date, required: true },
    doctor: { type: String, required: true },
    specialty: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    dni: { type: String, required: true }, // Agregar el campo DNI
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;


