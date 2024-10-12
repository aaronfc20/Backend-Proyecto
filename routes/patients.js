const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Registrar un nuevo paciente
router.post('/', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
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

        // Si se proporciona un DNI, buscar solo por DNI
        if (dni) {
            query.dni = dni;
        } else if (nombreCompleto) {
            // Buscar por nombre completo
            query.nombreCompleto = { $regex: nombreCompleto, $options: 'i' }; // Case insensitive
        } else {
            return res.status(400).json({ message: 'Se necesita completar el campo de nombre completo o DNI para realizar la búsqueda.' });
        }

        const patients = await Patient.find(query);

        // Verificar si hay pacientes que coinciden
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pacientes con esos datos.' });
        }

        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;




