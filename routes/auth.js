const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.post(
    '/login',
    [
        check('dniOrCode', 'Se requiere un DNI o Código de colegiatura').not().isEmpty(),
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
            console.log(`Rol recibido: ${role}, DNI o código de colegiatura recibido: ${dniOrCode}`); // Verificar rol y DNI o código

            if (role === 'user') {
                // Buscar por DNI si es usuario
                user = await User.findOne({ where: { dni: dniOrCode } });
                if (!user) {
                    console.log('Usuario no encontrado con el DNI:', dniOrCode);
                    return res.status(400).json({ msg: 'El usuario no existe' });
                }
            } else if (role === 'doctor') {
                // Buscar por código de colegiatura si es médico
                user = await User.findOne({ where: { colegiatura: dniOrCode } });
                if (!user) {
                    console.log('Médico no encontrado con el código:', dniOrCode);
                    return res.status(400).json({ msg: 'El médico no existe' });
                }
            }

            console.log('Usuario o médico encontrado:', user.name); // Verificar que el usuario fue encontrado

            // Comparar la contraseña con bcrypt
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Contraseña incorrecta');
                return res.status(400).json({ msg: 'Contraseña incorrecta' });
            }

            console.log('Contraseña correcta, generando token JWT...');
            // Si la contraseña es correcta, generar un token JWT
            const payload = { user: { id: user.id, role: user.role } };

            jwt.sign(
                payload,
                'secreto', // Cambia por un secreto más seguro en producción
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    console.log('Token generado:', token);
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error('Error en el servidor:', err.message);
            res.status(500).send('Error en el servidor');
        }
    }
);

module.exports = router;
