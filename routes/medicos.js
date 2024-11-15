// routes/medicos.js
const express = require('express');
const router = express.Router();
const {
    obtenerMedicos,
    obtenerMedicosPorEspecialidad,
    crearMedico,
    cargarMedicos // Asegúrate de que esta función esté exportada y definida en el controlador
} = require('../controllers/Medico');

// Rutas para operaciones CRUD de médicos
router.get('/', obtenerMedicos);
router.get('/especialidad/:especialidad', obtenerMedicosPorEspecialidad);
router.post('/', crearMedico);
router.post('/cargar', cargarMedicos); // Ruta para cargar múltiples médicos desde JSON

module.exports = router;
