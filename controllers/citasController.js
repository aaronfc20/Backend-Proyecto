const { Cita, Patient, MedicoR } = require('../models/Asociaciones'); // Importar asociaciones configuradas

// Registrar una cita
const registrarCita = async (req, res) => {
  const { pacienteId, doctorId, fecha, hora, especialidad, sede, tipoSeguro, metodoPago } = req.body;

  try {
    // Verificar si ya existe una cita para el mismo doctor y horario
    const citaExistente = await Cita.findOne({
      where: { fecha, hora, doctorId },
    });

    if (citaExistente) {
      return res.status(400).json({ message: 'Horario no disponible. Escoja otro horario.' });
    }

    // Registrar la nueva cita
    const nuevaCita = await Cita.create({
      pacienteId,
      doctorId,
      fecha,
      hora,
      especialidad,
      sede,
      tipoSeguro,
      metodoPago,
      estado: 'pendiente', // Estado predeterminado
    });

    res.status(201).json({
      message: 'Cita registrada exitosamente.',
      cita: nuevaCita,
    });
  } catch (error) {
    console.error('Error al registrar la cita:', error);
    res.status(500).json({ message: 'Error al registrar la cita.' });
  }
};

// Verificar disponibilidad de un horario
const verificarDisponibilidad = async (req, res) => {
  const { doctorId, fecha, hora } = req.params;

  if (!doctorId || !fecha || !hora) {
    return res.status(400).json({ message: 'Faltan datos para verificar disponibilidad.' });
  }

  try {
    const citaExistente = await Cita.findOne({
      where: { fecha, hora, doctorId },
    });

    if (citaExistente) {
      return res.status(404).json({ message: 'Horario no disponible.' });
    }

    res.status(200).json({ message: 'Horario disponible.' });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ message: 'Error al verificar disponibilidad.' });
  }
};


// Obtener horarios disponibles para un doctor en una fecha específica
const obtenerHorariosDisponibles = async (req, res) => {
  const { doctorId, fecha } = req.params;

  try {
    // Buscar todas las citas del doctor en la fecha dada
    const citas = await Cita.findAll({
      where: { doctorId, fecha },
      attributes: ['hora'],
    });

    const horasReservadas = citas.map((cita) => cita.hora);

    // Lista de horarios disponibles (ajústala según tu lógica de horarios)
    const horariosDisponibles = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00',
    ].filter((hora) => !horasReservadas.includes(hora));

    res.status(200).json(horariosDisponibles);
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    res.status(500).json({ message: 'Error al obtener horarios disponibles.' });
  }
};

module.exports = { registrarCita, verificarDisponibilidad, obtenerHorariosDisponibles };
