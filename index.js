const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Conexión a PostgreSQL
const Medico = require('./models/Médico'); // Importa el modelo de Médico
const Horario = require('./models/horario'); // Importa el modelo de Horario
const { Cita, Patient, Medico } = require('./models/Asociaciones');

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const citaRoutes = require('./routes/citas');
const patientRoutes = require('./routes/patients');
const medicoRoutes = require('./routes/medicos');
const horarioRoutes = require('./routes/horarios'); // Rutas de horarios



const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos con Sequelize y cargar los datos de médicos y horarios
sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Base de datos sincronizada');
        
        // Aquí puedes cargar los horarios si aún no existen en la base de datos.
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

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

