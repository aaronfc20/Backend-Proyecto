const { Op } = require('sequelize');
const moment = require('moment');
const { Cita, User, MedicoR } = require('../models/Asociaciones'); // Asegúrate de importar los modelos correctos
const { enviarCorreo } = require('../servicio/emailService');

const enviarRecordatorioCitas = async () => {
  const now = moment();
  const cincoMinutosDespues = moment().add(5, 'minutes');

  // Consultar citas dentro de los próximos 5 minutos
  const citasProximas = await Cita.findAll({
    where: {
      fecha: {
        [Op.between]: [now.format('YYYY-MM-DD HH:mm:ss'), cincoMinutosDespues.format('YYYY-MM-DD HH:mm:ss')]
      }
    },
    include: [
      { model: User, as: 'usuario', attributes: ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correoElectronico'] }, // Relación con User (alias 'usuario')
      { model: MedicoR, as: 'medico', attributes: ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'correoElectronico'] } // Relación con Medico (alias 'medico')
    ]
  });

  // Enviar correos a pacientes y médicos
  for (const cita of citasProximas) {
    const paciente = cita.usuario; // Usar 'usuario' como alias para el paciente
    const medico = cita.medico; // Usar 'medico' como alias para el médico

    // Verificar que existan los correos electrónicos antes de intentar enviar
    if (paciente && paciente.correoElectronico && medico && medico.correoElectronico) {
      // Enviar correo al paciente
      await enviarCorreo({
        to: paciente.correoElectronico,
        subject: 'Recordatorio de Cita Médica',
        text: `Estimado/a ${paciente.nombres} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno}, su cita con el Dr. ${medico.nombres} ${medico.apellidoPaterno} ${medico.apellidoMaterno} es a las ${cita.hora}.`
      });

      // Enviar correo al médico
      await enviarCorreo({
        to: medico.correoElectronico,
        subject: 'Recordatorio de Cita Médica',
        text: `Estimado/a Dr. ${medico.nombres} ${medico.apellidoPaterno} ${medico.apellidoMaterno}, tiene una cita con el paciente ${paciente.nombres} ${paciente.apellidoPaterno} ${paciente.apellidoMaterno} a las ${cita.hora}.`
      });
    } else {
      console.log('Correo no disponible para paciente o médico');
    }
  }
};

module.exports = { enviarRecordatorioCitas };
