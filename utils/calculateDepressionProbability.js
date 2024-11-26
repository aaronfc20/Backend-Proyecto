function calcularProbabilidadDepresion(respuestas) {
  let puntaje = 0;

  respuestas.forEach(respuesta => {
    switch (respuesta) {
      case 'Ningún día':
        puntaje += 0;
        break;
      case 'Varios días':
        puntaje += 1;
        break;
      case 'Más de la mitad de los días':
        puntaje += 2;
        break;
      case 'Casi todos los días':
        puntaje += 3;
        break;
      default:
        break;
    }
  });

  // Ajustamos los rangos según los nuevos puntajes posibles.
  if (puntaje <= 7) {
    return 'Baja';
  } else if (puntaje <= 14) {
    return 'Media';
  } else {
    return 'Alta';
  }
}

module.exports = calcularProbabilidadDepresion;
