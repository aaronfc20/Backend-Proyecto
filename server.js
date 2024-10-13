const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('./routes/patients');
require('dotenv').config();
const citaRoutes = require('./routes/citas'); // Importa las rutas de citas

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Cambia a tu URL del frontend
}));
app.use(express.json());

// Conectar a MongoDB sin opciones obsoletas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB Atlas.');
        // Iniciar el servidor solo después de conectar a la base de datos
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB Atlas:', error);
    });

// Rutas
app.use('/patients', patientRoutes);
app.use('/citas', citaRoutes); // Agregar las rutas de citas

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});
