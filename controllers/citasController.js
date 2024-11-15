const pool = require('../config/db');

// Registrar una cita
const registrarCita = async (req, res) => {
  const { paciente_id, fecha, hora } = req.body;

  try {
    // Verificar si el horario está disponible
    const horarioResult = await pool.query(
      'SELECT * FROM horarios WHERE fecha = $1 AND hora = $2 AND disponible = TRUE',
      [fecha, hora]
    );

    if (horarioResult.rows.length === 0) {
      return res.status(400).json({ message: 'Horario no disponible. Escoja otro horario.' });
    }

    // Obtener el id del horario disponible
    const horario_id = horarioResult.rows[0].id;

    // Registrar la cita en la tabla de reservas
    await pool.query(
      'INSERT INTO reservas (paciente_id, horario_id) VALUES ($1, $2)',
      [paciente_id, horario_id]
    );

    // Marcar el horario como no disponible
    await pool.query(
      'UPDATE horarios SET disponible = FALSE WHERE id = $1',
      [horario_id]
    );

    res.status(200).json({ message: 'Cita registrada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la cita.' });
  }
};

// Verificar disponibilidad de un horario
const verificarDisponibilidad = async (req, res) => {
  const { fecha, hora } = req.params;

  try {
    // Verificar si el horario está disponible
    const horarioResult = await pool.query(
      'SELECT * FROM horarios WHERE fecha = $1 AND hora = $2 AND disponible = TRUE',
      [fecha, hora]
    );

    if (horarioResult.rows.length === 0) {
      return res.status(404).json({ message: 'Horario no disponible.' });
    }

    res.status(200).json({ message: 'Horario disponible.', horario: horarioResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar disponibilidad.' });
  }
};

// Obtener horarios disponibles para una fecha
const obtenerHorariosDisponibles = async (req, res) => {
  const { fecha } = req.params;

  try {
    const horariosResult = await pool.query(
      'SELECT * FROM horarios WHERE fecha = $1 AND disponible = TRUE',
      [fecha]
    );

    res.status(200).json(horariosResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener horarios.' });
  }
};

module.exports = { registrarCita, verificarDisponibilidad, obtenerHorariosDisponibles };
