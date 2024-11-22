// controllers/medicosController.js
const Medico = require('../models/Médico');
const medicosData = require('../data/medicos.json');
const bcrypt = require('bcryptjs');

// Obtener todos los médicos
exports.obtenerMedicos = async (req, res) => {
    try {
        const medicos = await Medico.findAll();
        res.status(200).json(medicos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los médicos', error });
    }
};

// Obtener médicos por especialidad
exports.obtenerMedicosPorEspecialidad = async (req, res) => {
    try {
        const { especialidad } = req.params;
        const medicos = await Medico.findAll({ where: { especialidad } });
        res.status(200).json(medicos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los médicos por especialidad', error });
    }
};

// Obtener médicos por sede, especialidad y tipo de cita
exports.obtenerMedicosPorSedeYEspecialidad = async (req, res) => {
    try {
        const { sede, especialidad } = req.query;

        // Verifica qué parámetros fueron enviados
        console.log('Parámetros recibidos:', { sede, especialidad });

        // Filtrar médicos dinámicamente según los parámetros proporcionados
        const medicos = await Medico.findAll({
            where: {
                ...(sede && { sede }), // Filtrar por sede si está presente
                ...(especialidad && { especialidad }), // Filtrar por especialidad si está presente
            },
        });

        if (medicos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron médicos para los filtros proporcionados.' });
        }

        res.status(200).json(medicos);
    } catch (error) {
        console.error('Error al obtener los médicos:', error);
        res.status(500).json({ message: 'Error al obtener los médicos', error });
    }
};

// Crear un nuevo médico con contraseña cifrada
exports.crearMedico = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Cifrar la contraseña
        const nuevoMedico = await Medico.create({ ...rest, password: hashedPassword });
        res.status(201).json(nuevoMedico);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el médico', error });
    }
};

// Cargar múltiples médicos desde JSON con contraseñas cifradas
exports.cargarMedicos = async (req, res) => {
    try {
        const hashedMedicos = await Promise.all(
            medicosData.map(async (medico) => {
                const salt = await bcrypt.genSalt(10);
                medico.password = await bcrypt.hash(medico.password, salt);
                return medico;
            })
        );
        const nuevosMedicos = await Medico.bulkCreate(hashedMedicos);
        res.status(201).json(nuevosMedicos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cargar los médicos', error });
    }
};
