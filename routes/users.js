// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

class UserFactory {
    static createUser(data) {
        if (data.role === 'user') {
            return new User({
                name: data.name,
                dni: data.dniOrCode,
                password: data.password,
                role: 'user',
            });
        } else if (data.role === 'doctor') {
            return new User({
                name: data.name,
                colegiatura: data.dniOrCode,
                password: data.password,
                role: 'doctor',
            });
        }
        throw new Error('Rol inválido');
    }
}

// Ruta para registrar usuarios o doctores
router.post('/register', async (req, res) => {
    const { name, dniOrCode, password, role } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear usuario usando la fábrica
        const user = UserFactory.createUser({ name, dniOrCode, password: hashedPassword, role });
        
        // Guardar el usuario en la base de datos
        await user.save();
        
        res.status(201).json({ message: `Cuenta creada con éxito`, user });
    } catch (error) {
        console.error('Error al registrar:', error);
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
});

module.exports = router;
