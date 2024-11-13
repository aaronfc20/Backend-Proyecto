const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Registrar un nuevo paciente
router.post('/', async (req, res) => {
    try {
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
