const express = require('express');
const { sendEmail } = require('../services/emailService');
const router = express.Router();
const Cita = require('../models/Cita');
const Patient = require('../models/Patient');
const User = require('../models/User'); // Modelo de usuarios para los doctores

router.post('/send-reminder/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener la cita
        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

        // Obtener información del paciente
        const patient = await Patient.findOne({ dni: cita.pacienteId });
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });

        // Obtener información del doctor
        const doctor = await User.findByPk(cita.doctorId); // Relación directa
        if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor no encontrado' });

        // Crear los correos
        const patientSubject = 'Recordatorio de Cita Médica';
        const patientText = `Hola ${patient.nombreCompleto},\n\nTe recordamos que tienes una cita programada para el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        const doctorSubject = 'Recordatorio de Cita con Paciente';
        const doctorText = `Hola Dr. ${doctor.name},\n\nLe recordamos que tiene una cita programada con el paciente ${patient.nombreCompleto} (DNI: ${patient.dni}) el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        // Enviar correos
        await sendEmail(patient.email, patientSubject, patientText);
        await sendEmail(doctor.email, doctorSubject, doctorText);

        res.status(200).json({ message: 'Correos enviados con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar los correos' });
    }
});

module.exports = router;
