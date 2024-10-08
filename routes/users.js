// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Ruta para registrar usuarios o doctores
router.post('/register', async (req, res) => {
    const { name, dniOrCode, password, role } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (role === 'user') {
            // Crear un usuario
            user = await User.create({
                name,
                dni: dniOrCode,
                password: hashedPassword,
                role: 'user'
            });
        } else if (role === 'doctor') {
            // Crear un doctor
            user = await User.create({
                name,
                colegiatura: dniOrCode,
                password: hashedPassword,
                role: 'doctor'
            });
        } else {
            return res.status(400).json({ error: 'Rol inválido. Debe ser "user" o "doctor".' });
        }

        res.status(201).json({ message: `Cuenta creada con éxito`, user });
    } catch (error) {
        console.error('Error al registrar:', error);
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
});

module.exports = router;
