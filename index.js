const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Conexión a PostgreSQL
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const citaRoutes = require('./routes/citas');
const patientRoutes = require('./routes/patients'); // Asumiendo que el modelo de pacientes se ha convertido a Sequelize

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos con Sequelize
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Configurar las rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/citas', citaRoutes);
app.use('/patients', patientRoutes); // Ruta para pacientes

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Historial Médico');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
