const express = require('express');
const { 
    registrarCita, 
    verificarDisponibilidad, 
    obtenerHorariosDisponibles, 
    obtenerCitasUsuario,
    registrarFeedback
} = require('../controllers/citasController'); // Importar funciones del controlador
const { sendEmail } = require('../servicio/emailService');
const router = express.Router();
const { Cita, User, Feedback } = require('../models/Asociaciones'); // Asegúrate de que las asociaciones estén configuradas correctamente

// Ruta para registrar una cita
router.post('/registrar', registrarCita);

// Ruta para verificar disponibilidad de un horario
router.get('/disponibilidad/:doctorId/:fecha/:hora', verificarDisponibilidad);

// Ruta para obtener horarios disponibles de un doctor en una fecha
router.get('/horarios-disponibles/:doctorId/:fecha', obtenerHorariosDisponibles);

// Ruta para obtener las citas de un usuario específico
router.get('/usuario/:pacienteId', obtenerCitasUsuario);

router.post('/:citaId/feedback', async (req, res) => {
    try {
        const { citaId } = req.params;
        const { rating, feedback } = req.body;

        // Crear el feedback en la base de datos
        const newFeedback = await Feedback.create({
            citaId,
            puntaje: rating,
            comentario: feedback,
        });

        res.status(201).json(newFeedback);
    } catch (error) {
        console.error('Error al guardar el feedback:', error);
        res.status(500).json({ message: 'Hubo un problema al guardar el feedback.' });
    }
});


// Ruta para enviar un recordatorio de cita
router.post('/send-reminder/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener la cita junto con usuario y médico
        const cita = await Cita.findByPk(id, {
            include: [
                { model: User, as: 'usuario' }, // Paciente
                { model: User, as: 'medico' }  // Médico
            ]
        });

        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });

        const patientName = `${cita.usuario.nombres} ${cita.usuario.apellidoPaterno}`;
        const doctorName = `${cita.medico.nombres} ${cita.medico.apellidoPaterno}`;

        // Crear los correos
        const patientSubject = 'Recordatorio de Cita Médica';
        const patientText = `Hola ${patientName},\n\nTe recordamos que tienes una cita programada para el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        const doctorSubject = 'Recordatorio de Cita con Paciente';
        const doctorText = `Hola Dr. ${doctorName},\n\nLe recordamos que tiene una cita programada con el paciente ${patientName} el día ${cita.fecha} a las ${cita.hora}.\n\nGracias,`;

        // Enviar correos
        await sendEmail(cita.usuario.correoElectronico, patientSubject, patientText);
        await sendEmail(cita.medico.correoElectronico, doctorSubject, doctorText);

        res.status(200).json({ message: 'Correos enviados con éxito' });
    } catch (error) {
        console.error('Error en /send-reminder:', error);
        res.status(500).json({ message: 'Error al enviar los correos.' });
    }
});

module.exports = router;
