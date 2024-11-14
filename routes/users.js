// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Ruta para registrar usuarios
// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
    const {
        dni,
        apellidoPaterno,
        apellidoMaterno,
        nombres,
        fechaNacimiento,
        numeroCelular,
        genero,
        correoElectronico,
        password
    } = req.body;

    console.log("Datos recibidos:", req.body); // Registro de datos recibidos

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario con los datos proporcionados
        const user = await User.create({
            dni,
            apellidoPaterno,
            apellidoMaterno,
            nombres,
            fechaNacimiento,
            numeroCelular,
            genero,
            correoElectronico,
            password: hashedPassword,
            role: 'user',
        });

        res.status(201).json({ message: 'Cuenta creada con éxito', user });
    } catch (error) {
        console.error('Error al registrar:', error);

        // Detecta errores específicos de Sequelize, como constraint violations
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'El DNI o correo electrónico ya están registrados' });
        }

        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
});

module.exports = router;
