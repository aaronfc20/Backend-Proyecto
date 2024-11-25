const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize'); // Importa Sequelize
const Database = require('./config/database'); // Importa el Singleton de conexión
const sequelize = Database.getConnection(); // Usa el Singleton correctamente

const { userRoutes, authRoutes, citaRoutes, patientRoutes, medicoRoutes, horarioRoutes } = require('./routes/indexRutas');
const testDePresionRoutes = require('./routes/testDePresion'); // Importa las rutas del test de depresión

const cron = require('node-cron');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Feedback = require('./models/feedback')(sequelize, Sequelize.DataTypes);
const { sendEmail } = require('./servicio/emailService');

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Middleware para los test de depresión
app.use('/api/test-de-presion', testDePresionRoutes); // Ruta para el test de depresión

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync()
  .then(() => {
    // Configurar las rutas
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
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });
