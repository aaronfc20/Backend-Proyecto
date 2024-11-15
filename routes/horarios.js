const express = require('express');
const Horario = require('../models/horario');
const router = express.Router();

// Ruta para obtener los horarios disponibles
router.get('/', async (req, res) => {
    try {
        const horarios = await Horario.findAll({
            where: { disponible: true },
            order: [['fecha', 'ASC'], ['hora', 'ASC']]
        });
        res.json(horarios);
    } catch (err) {
        console.error('Error al obtener los horarios:', err);
        res.status(500).send('Error al obtener los horarios');
    }
});

// Ruta para registrar una cita (marcar un horario como no disponible)
router.post('/reservar', async (req, res) => {
    const { horario_id, paciente_id } = req.body;

    try {
        // Verifica si el horario existe y está disponible
        const horario = await Horario.findByPk(horario_id);
        if (!horario) {
            return res.status(404).send('Horario no encontrado');
        }

        if (!horario.disponible) {
            return res.status(400).send('Horario no disponible. Escoja otro');
        }

        // Marca el horario como no disponible
        await horario.update({ disponible: false });

        // Aquí podrías agregar el registro en la tabla de citas, si es necesario
        // const cita = await Cita.create({ paciente_id, horario_id });

        res.status(200).send('Reserva realizada con éxito');
    } catch (err) {
        console.error('Error al realizar la reserva:', err);
        res.status(500).send('Error al realizar la reserva');
    }
});

module.exports = router;
