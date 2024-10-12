const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');

// Ruta para obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.findAll(); // Obtener todas las citas
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error });
  }
});

// Ruta para crear una nueva cita
router.post('/', async (req, res) => {
  const { nombreCompleto, motivo, hora } = req.body;

  try {
    const nuevaCita = await Cita.create({
      nombreCompleto,
      motivo,
      hora
    });
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la cita', error });
  }
});

module.exports = router;
