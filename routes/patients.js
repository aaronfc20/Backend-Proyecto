const express = require('express');
const { Op } = require('sequelize'); // Para búsquedas avanzadas
const router = express.Router();
const Patient = require('../models/patient');

// Registrar un nuevo paciente
router.post('/registrar', async (req, res) => {
    try {
        const { dni } = req.body;

        // Verificar si ya existe un paciente con el mismo DNI
        const existingPatient = await Patient.findOne({ where: { dni } });

        if (existingPatient) {
            return res.status(409).json({ message: 'El paciente con este DNI ya está registrado.' });
        }

        const newPatient = await Patient.create(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Buscar paciente por nombre completo o por DNI
router.get('/search', async (req, res) => {
    const { nombreCompleto, dni } = req.query;

    try {
        let query = {};

        if (dni) {
            query.dni = dni;
        } else if (nombreCompleto) {
            query.nombreCompleto = { [Op.iLike]: `%${nombreCompleto}%` };
        } else {
            return res.status(400).json({ message: 'Se necesita completar el campo de nombre completo o DNI para realizar la búsqueda.' });
        }

        const patients = await Patient.findAll({ where: query });

        if (patients.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pacientes con esos datos.' });
        }

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
