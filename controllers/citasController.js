const { Cita, User, MedicoR } = require('../models/Asociaciones');
const { Feedback } = require('../models/feedback');

// Registrar una cita
const registrarCita = async (req, res) => {
  try {
      const { pacienteId, doctorId, fecha, hora, especialidad, sede, tipoSeguro, metodoPago } = req.body;

      if (!sede && metodoPago !== 'teleconsulta') {
          return res.status(400).json({
              message: 'El campo "sede" es obligatorio para citas presenciales.',
          });
      }

      const nuevaCita = await Cita.create({
          pacienteId,
          doctorId,
          fecha,
          hora,
          especialidad,
          sede: sede || null,
          tipoSeguro,
          metodoPago,
      });

      res.status(201).json(nuevaCita);
  } catch (error) {
      console.error('Error al registrar la cita:', error);
      res.status(500).json({
          message: 'Error al registrar la cita.',
          error: error.message,
      });
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

// Obtener el resumen de citas de un usuario
const obtenerCitasUsuario = async (req, res) => {
  const { pacienteId } = req.params;

  try {
    const citas = await Cita.findAll({
      where: { pacienteId },
      include: [
        { model: MedicoR, as: 'medico', attributes: ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'sede'] }, // Incluye la sede
        { model: User, as: 'usuario', attributes: ['nombres', 'apellidoPaterno'] },
      ],
    });

    if (citas.length === 0) {
      return res.status(404).json({ message: 'No tiene citas programadas.' });
    }

    const resumenCitas = citas.map((cita) => ({
      id: cita.id,
      especialidad: cita.especialidad,
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      medico: `${cita.medico.nombres} ${cita.medico.apellidoPaterno} ${cita.medico.apellidoMaterno}`,
      sede: cita.sede ? cita.sede : cita.metodoPago === 'teleconsulta' ? 'Teleconsulta' : null,
      tipoSeguro: cita.tipoSeguro, // Asegúrate de que este dato esté incluido
    }));

    res.status(200).json(resumenCitas);
  } catch (error) {
    console.error('Error al obtener las citas del usuario:', error);
    res.status(500).json({ message: 'Error al obtener las citas del usuario.' });
  }
};

const registrarFeedback = async (req, res) => {
  const { citaId } = req.params;
  const { puntaje, comentario } = req.body;

  try {
    // Verificar que la cita existe
    const cita = await Cita.findByPk(citaId);
    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Registrar el feedback
    const feedback = await Feedback.create({
      citaId,
      puntaje,
      comentario,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error al registrar feedback:', error);
    res.status(500).json({ message: 'Error al registrar feedback' });
  }
};


module.exports = {
  registrarCita,
  verificarDisponibilidad,
  obtenerHorariosDisponibles,
  obtenerCitasUsuario,
  registrarFeedback,
};
