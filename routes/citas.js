const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');

router.post('/', async (req, res) => {
    const { fecha, hora, pacienteId, doctorId } = req.body;

    try {
        const nuevaCita = await Cita.create({ fecha, hora, pacienteId, doctorId });
        res.status(201).json(nuevaCita);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la cita' });
    }
});

module.exports = router;

