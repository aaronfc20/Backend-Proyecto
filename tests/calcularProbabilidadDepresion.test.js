const calcularProbabilidadDepresion = require('../utils/calculateDepressionProbability');

describe('calcularProbabilidadDepresion', () => {
  test('Debería retornar "Baja" para puntaje menor o igual a 7', () => {
    // Respuestas: todas "Ningún día" (0 puntos cada una).
    const respuestas = ['Ningún día', 'Ningún día', 'Ningún día', 'Ningún día', 'Ningún día', 'Ningún día', 'Ningún día'];
    const resultado = calcularProbabilidadDepresion(respuestas);
    expect(resultado).toBe('Baja');  // Puntaje = 0, está dentro del rango de "Baja".
  });

  test('Debería retornar "Media" para puntaje entre 8 y 14', () => {
    // Respuestas: todas "Varios días" (1 punto cada una).
    const respuestas = ['Varios días', 'Varios días', 'Varios días', 'Varios días', 'Varios días', 'Varios días', 'Casi todos los días'];
    const resultado = calcularProbabilidadDepresion(respuestas);
    expect(resultado).toBe('Media');  // Puntaje = 7, debería ser "Media" entre 8 y 14 puntos.
  });

  test('Debería retornar "Alta" para puntaje mayor a 14', () => {
    // Respuestas: todas "Casi todos los días" (3 puntos cada una).
    const respuestas = ['Casi todos los días', 'Casi todos los días', 'Casi todos los días', 'Casi todos los días', 'Casi todos los días', 'Casi todos los días', 'Casi todos los días'];
    const resultado = calcularProbabilidadDepresion(respuestas);
    expect(resultado).toBe('Alta');  // Puntaje = 21, que está dentro del rango de "Alta".
  });
});

