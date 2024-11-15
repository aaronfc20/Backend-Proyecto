const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Medico = require('../models/Médico');
const router = express.Router();

// auth.js - Backend
router.post(
    '/login',
    [
        check('dniOrCode', 'Se requiere un DNI o Correo electrónico').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { role, dniOrCode, password } = req.body;

        try {
            let user;

            if (role === 'user') {
                // Buscar por DNI si es usuario
                user = await User.findOne({ where: { dni: dniOrCode } });
                if (!user) {
                    console.log('Usuario no encontrado con el DNI:', dniOrCode);
                    return res.status(400).json({ msg: 'El usuario no existe' });
                }
            } else if (role === 'doctor') {
                // Buscar por correo electrónico si es médico
                user = await Medico.findOne({ where: { correoElectronico: dniOrCode } });
                if (!user) {
                    console.log('Médico no encontrado con el correo:', dniOrCode);
                    return res.status(400).json({ msg: 'El médico no existe' });
                }
            }

            // Comparar la contraseña con bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Contraseña incorrecta');
                return res.status(400).json({ msg: 'Contraseña incorrecta' });
            }

            console.log('Contraseña correcta, generando token JWT...');
            // Generar un token JWT
            const payload = { user: { id: user.id, role: user.role || 'doctor' } };

            jwt.sign(
                payload,
                'secreto', // Cambia por un secreto más seguro en producción
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    console.log('Token generado:', token);

                    // Enviar el token y todos los datos del usuario al frontend
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            correoElectronico: user.correoElectronico,
                            apellidoPaterno: user.apellidoPaterno,
                            apellidoMaterno: user.apellidoMaterno,
                            nombres: user.nombres,
                            role: user.role || 'doctor',
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            // Agregar los campos adicionales necesarios
                            genero: user.genero || 'No especificado',
                            fechaNacimiento: user.fechaNacimiento || '',
                        
                        }
                    });
                }
            );
        } catch (err) {
            console.error('Error en el servidor:', err.message);
            res.status(500).send('Error en el servidor');
        }
    }
);

module.exports = router;
