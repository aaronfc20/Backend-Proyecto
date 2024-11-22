const express = require('express');
const { registrarCita, verificarDisponibilidad, obtenerHorariosDisponibles } = require('../controllers/citasController'); // Importar funciones del controlador
const { sendEmail } = require('../servicio/emailService');
const router = express.Router();
const { Cita, Patient, User } = require('../models/Asociaciones'); // Asegúrate de que las asociaciones estén configuradas correctamente

// Ruta para registrar una cita
router.post('/registrar', registrarCita);

// Ruta para verificar disponibilidad de un horario
router.get('/disponibilidad/:doctorId/:fecha/:hora', verificarDisponibilidad);

// Ruta para obtener horarios disponibles de un doctor en una fecha
router.get('/horarios-disponibles/:doctorId/:fecha', obtenerHorariosDisponibles);

// Ruta para enviar un recordatorio de cita
router.post('/send-reminder/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener la cita junto con paciente y doctor
        const cita = await Cita.findByPk(id, {
            include: [
                { model: Patient, as: 'paciente' },
                { model: User, as: 'medico' }
            ]
        });

        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

        const patient = cita.paciente;
        const doctor = cita.medico;

        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Doctor no encontrado' });

        // Crear los correos
        const patientSubject = 'Recordatorio de Cita Médica';
        const patientText = `Hola ${patient.nombreCompleto},\n\nTe recordamos que tienes una cita programada para el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        const doctorSubject = 'Recordatorio de Cita con Paciente';
        const doctorText = `Hola Dr. ${doctor.apellidoPaterno},\n\nLe recordamos que tiene una cita programada con el paciente ${patient.nombreCompleto} (DNI: ${patient.dni}) el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        // Enviar correos
        await sendEmail(patient.correoElectronico, patientSubject, patientText);
        await sendEmail(doctor.correoElectronico, doctorSubject, doctorText);

        res.status(200).json({ message: 'Correos enviados con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar los correos' });
    }
});

module.exports = router;
