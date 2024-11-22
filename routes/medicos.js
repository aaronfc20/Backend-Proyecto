// routes/medicos.js
const express = require('express');
const router = express.Router();
const {
    obtenerMedicos,
    obtenerMedicosPorEspecialidad,
    obtenerMedicosPorSedeYEspecialidad, // Nueva función
    crearMedico,
    cargarMedicos
} = require('../controllers/Medico');

// Rutas para operaciones CRUD de médicos
router.get('/', obtenerMedicos);
router.get('/especialidad/:especialidad', obtenerMedicosPorEspecialidad);
router.get('/filtrar', obtenerMedicosPorSedeYEspecialidad); // Nueva ruta para filtrar médicos
router.post('/', crearMedico);
router.post('/cargar', cargarMedicos);

module.exports = router;
