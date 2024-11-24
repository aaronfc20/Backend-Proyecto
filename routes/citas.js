const express = require('express');
const { 
    registrarCita, 
    verificarDisponibilidad, 
    obtenerHorariosDisponibles, 
    obtenerCitasUsuario,
    registrarFeedback
} = require('../controllers/citasController'); // Importar funciones del controlador
const { enviarCorreo } = require('../servicio/emailService');

const router = express.Router();
const { Cita, User, MedicoR, Feedback, Patient } = require('../models/Asociaciones'); // Asegúrate de que las asociaciones estén configuradas correctamente

// Ruta para registrar una cita
router.post('/registrar', registrarCita);

// Ruta para verificar disponibilidad de un horario
router.get('/disponibilidad/:doctorId/:fecha/:hora', verificarDisponibilidad);

// Ruta para obtener horarios disponibles de un doctor en una fecha
router.get('/horarios-disponibles/:doctorId/:fecha', obtenerHorariosDisponibles);

// Ruta para obtener las citas de un usuario específico
router.get('/usuario/:pacienteId', obtenerCitasUsuario);


// Ruta para obtener las citas de un doctor específico

router.get('/todas/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Obtener las citas del doctor específico, incluyendo la información del paciente
        const citas = await Cita.findAll({
            where: {
                doctorId: doctorId // Filtrar las citas por el ID del doctor
            },
            include: [
                { model: User, as: 'usuario' }, // Incluir la información del paciente
            ]
        });

        // Si no hay citas, devolver un mensaje adecuado
        if (!citas || citas.length === 0) {
            return res.status(404).json({ message: 'No hay citas registradas para este médico.' });
        }

        // Formatear las citas para que el frontend las pueda usar
        const citasFormateadas = citas.map(cita => ({
            id: cita.id,
            paciente: {
                nombreCompleto: `${cita.usuario.nombres} ${cita.usuario.apellidoPaterno}`
            },
            fecha: cita.fecha,
            hora: cita.hora,
            horaFin: cita.horaFin
        }));

        // Devolver las citas como respuesta
        res.status(200).json(citasFormateadas);
    } catch (error) {
        console.error('Error al obtener las citas del doctor:', error);
        res.status(500).json({ message: 'Hubo un problema al obtener las citas del doctor.' });
    }
});

//Ruta para obtener todas las citas
router.get('/todas', async (req, res) => {
    try {
        // Obtener todas las citas, incluyendo el usuario y el médico relacionados
        const citas = await Cita.findAll({
            include: [
                { model: User, as: 'usuario' }, // Incluye la información del paciente
                { model: MedicoR, as: 'medico' }    // Incluye la información del médico
            ]
        });

        // Si no hay citas, devolver un mensaje adecuado
        if (!citas || citas.length === 0) {
            return res.status(404).json({ message: 'No hay citas registradas.' });
        }

        // Formatear las citas para que el frontend las pueda usar
        const citasFormateadas = citas.map(cita => ({
            id: cita.id,
            paciente: {
                nombreCompleto: `${cita.usuario.nombres} ${cita.usuario.apellidoPaterno}`
            },
            medico: {
                nombre: `${cita.medico.nombres} ${cita.medico.apellidoPaterno}`
            },
            fecha: cita.fecha,
            hora: cita.hora,
            horaFin: cita.horaFin
        }));

        // Devolver las citas como respuesta
        res.status(200).json(citasFormateadas);
    } catch (error) {
        console.error('Error al obtener todas las citas:', error);
        res.status(500).json({ message: 'Hubo un problema al obtener las citas.' });
    }
});

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

// Ruta para notificar al paciente
router.post('/notificar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar la cita por ID, incluyendo el paciente (User) y el médico (Medico)
        const cita = await Cita.findByPk(id, {
            include: [
                { model: User, as: 'usuario' }, // Alias 'usuario' para el paciente
                { model: MedicoR, as: 'medico' } // Alias 'medico' para el doctor
            ]
        });

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada.' });
        }

        // Obtener el paciente (usuario) y verificar si tiene correo electrónico
        const paciente = cita.usuario; // Usamos 'usuario' ya que es el alias definido
        const medico = cita.medico; // Usamos 'medico' ya que es el alias definido

        // Verificar si los datos son correctos
        console.log('Paciente:', paciente); // Verificar paciente
        console.log('Médico:', medico); // Verificar médico

        if (!paciente || !paciente.correoElectronico) {
            return res.status(400).json({ message: 'El paciente no tiene correo electrónico.' });
        }

        // Enviar el correo al paciente
        await enviarCorreo({
            to: paciente.correoElectronico, // Correo del paciente
            subject: 'Recordatorio de Cita Médica',
            text: `Estimado/a ${paciente.nombres} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}, su cita con el Dr. ${medico.nombres} ${medico.apellidoPaterno} ${medico.apellidoMaterno} es a las ${cita.hora}.`
        });

        res.status(200).json({ message: 'Correo enviado correctamente.' });
    } catch (error) {
        console.error('Error al notificar al paciente:', error);
        res.status(500).json({ message: 'Error al enviar el correo.' });
    }
});

module.exports = router;
