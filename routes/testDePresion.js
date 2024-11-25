const express = require('express');
const TestDePresion = require('../models/TestDePresion');
const calcularProbabilidadDepresion = require('../utils/calculateDepressionProbability');
const router = express.Router();

// Ruta para guardar el test
router.post('/guardar', async (req, res) => {
  const { respuestas } = req.body;

  // Calcular la probabilidad de depresión
  const probabilidadDepresion = calcularProbabilidadDepresion(respuestas);

  try {
    // Crear el registro en la base de datos
    const test = await TestDePresion.create({
      respuestas,
      probabilidadDepresion,
    });

    res.status(200).json({ mensaje: 'Test guardado exitosamente', test });
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al guardar el test' });
  }
});

// Ruta para obtener los resultados de los tests
router.get('/resultados', async (req, res) => {
  try {
    const tests = await TestDePresion.findAll();
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener los resultados' });
  }
});

// Ruta para obtener estadísticas de las respuestas
router.get('/estadisticas', async (req, res) => {
  try {
    const tests = await TestDePresion.findAll();
    const respuestaCounts = {
      "Ningún día": 0,
      "Varios días": 0,
      "Más de la mitad de los días": 0,
      "Casi todos los días": 0,
    };

    tests.forEach(test => {
      test.respuestas.forEach(respuesta => {
        respuestaCounts[respuesta]++;
      });
    });

    res.status(200).json(respuestaCounts);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener las estadísticas' });
  }
});

module.exports = router;
