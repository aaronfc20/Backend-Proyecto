const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');  // Importar las rutas de autenticación
const citaRoutes = require('./routes/citas');


const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Sincronizar la base de datos
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });

// Usar las rutas para usuarios/doctores
app.use('/api/users', userRoutes);

// Usar las rutas para autenticación (login)
app.use('/api/auth', authRoutes);  // Agregar la ruta de autenticación

app.use('/citas', citaRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Historial Médico');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});



///////////////////////Para poder subiiiiiiiir ////////////////////////


