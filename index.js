const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Conexión a PostgreSQL
const Medico = require('./models/Médico'); // Importa el modelo de Médico
const Horario = require('./models/horario'); // Importa el modelo de Horario
const { Cita, Patient, MedicoR } = require('./models/Asociaciones');

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const citaRoutes = require('./routes/citas');
const patientRoutes = require('./routes/patients');
const medicoRoutes = require('./routes/medicos');
const horarioRoutes = require('./routes/horarios'); // Rutas de horarios

const cron = require('node-cron');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const { sendEmail } = require('./servicio/emailService');


const app = express();
const port = 3001;

// Configuración del transporter para nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia esto si usas otro proveedor
    auth: {
        user: 'tu-email@gmail.com', // Cambia esto por tu correo
        pass: 'tu-contraseña-app', // Usa una contraseña de aplicación si usas Gmail
    },
});

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos con Sequelize y cargar los datos de médicos y horarios
sequelize.sync()
    .then(async () => {
        console.log('Base de datos sincronizada');

         /*Cargar médicos desde medicos.json
        const bcrypt = require('bcryptjs');
        const medicosData = require('./data/medicos.json');

        try {
            // Encriptar contraseñas y preparar datos
            const hashedMedicos = await Promise.all(
                medicosData.map(async (medico) => {
                    medico.password = await bcrypt.hash(medico.password, 10); // Cifrar contraseña
                    return medico;
                })
            );

            // Insertar médicos en la base de datos
            await Medico.bulkCreate(hashedMedicos);
            console.log('Médicos cargados exitosamente');
        } catch (error) {
            console.error('Error al cargar médicos:', error);
        }*/
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Configurar las rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/citas', citaRoutes);
app.use('/patients', patientRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/horarios', horarioRoutes); // Usar las rutas de horarios

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Historial Médico');
});

// Tarea programada con node-cron para enviar recordatorios de citas
cron.schedule('0 9 * * *', async () => { // Se ejecutará todos los días a las 9:00 AM
    console.log('Ejecutando tarea programada para enviar recordatorios de citas...');

    try {
        const citasProximas = await Cita.findAll({
            where: {
                fecha: {
                    [Op.eq]: moment().add(3, 'days').format('YYYY-MM-DD'), // Citas dentro de 3 días
                },
            },
            include: [
                { model: Patient, as: 'paciente' },
                { model: Medico, as: 'medico' },
            ],
        });

        citasProximas.forEach(async (cita) => {
            const patient = cita.paciente;
            const doctor = cita.medico;

            if (!patient || !doctor) {
                console.error('Faltan datos del paciente o médico en la cita:', cita.id);
                return;
            }

            const doctorName = `${doctor.nombres} ${doctor.apellidoPaterno} ${doctor.apellidoMaterno}`;
            const patientEmail = patient.correoElectronico;
            const doctorEmail = doctor.correoElectronico;

            // Configuración del correo
            const mailOptions = {
                from: '"Sistema Médico" <no-reply@tuapp.com>',
                to: `${patientEmail}, ${doctorEmail}`, // Enviar a ambos
                subject: 'Recordatorio de Cita Médica',
                text: `Hola, esta es una notificación sobre la cita programada:\n\n
                - Paciente: ${patient.nombreCompleto}
                - Médico: ${doctorName}
                - Fecha: ${cita.fecha}
                - Hora: ${cita.hora}\n\n
                Por favor, asegúrate de estar presente a tiempo.`,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`Correo enviado exitosamente para la cita ID ${cita.id}`);
            } catch (error) {
                console.error(`Error al enviar el correo para la cita ID ${cita.id}:`, error);
            }
        });
    } catch (error) {
        console.error('Error al ejecutar la tarea programada:', error);
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

