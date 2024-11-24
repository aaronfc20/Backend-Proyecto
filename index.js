const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize'); // Importa Sequelize
const Database = require('./config/database'); // Importa el Singleton de conexión
const sequelize = Database.getConnection(); // Usa el Singleton correctamente

const Horario = require('./models/horario');
const { Cita, Patient, MedicoR } = require('./models/Asociaciones');

const cron = require('node-cron');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Feedback = require('./models/feedback')(sequelize, Sequelize.DataTypes);
const { sendEmail } = require('./servicio/emailService');

const { userRoutes, authRoutes, citaRoutes, patientRoutes, medicoRoutes, horarioRoutes } = require('./routes/indexRutas');



const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar base de datos
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Configurar rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/citas', citaRoutes);
app.use('/patients', patientRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/horarios', horarioRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Historial Médico');
});

// Programación con cron (cada 5 minutos para enviar recordatorios de citas)
cron.schedule('*/5 * * * *', async () => {
    console.log('Ejecutando tarea programada para enviar recordatorios de citas cada 5 minutos...');
    await enviarRecordatorioCitas(); // Función que consulta citas y manda correos
  });

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
