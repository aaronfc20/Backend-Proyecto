// index.js
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Conexión a PostgreSQL
const Medico = require('./models/Médico'); // Importa el modelo de Médico
const medicosData = require('./data/medicos.json'); // Importa los datos de médicos

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const citaRoutes = require('./routes/citas');
const patientRoutes = require('./routes/patients');
const medicoRoutes = require('./routes/medicos');

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Sincronizar la base de datos con Sequelize y cargar los datos de médicos
sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Base de datos sincronizada');

        // Verifica si existen médicos en la base de datos antes de cargarlos
        const medicosExistentes = await Medico.findAll();
        if (medicosExistentes.length === 0) {
            // Cifrar contraseñas antes de insertar
            const medicosConCredenciales = await Promise.all(
                medicosData.map(async (medico) => {
                    const hashedPassword = await bcrypt.hash(medico.password, 10);
                    console.log(`Médico: ${medico.nombres} - Contraseña cifrada: ${hashedPassword}`);
                    return { ...medico, password: hashedPassword };
                })
            );

            // Insertar médicos
            await Medico.bulkCreate(medicosConCredenciales);
            console.log('Médicos cargados en la base de datos');
        } else {
            console.log('Los médicos ya existen en la base de datos, no se agregaron nuevos registros.');

            // Actualizar contraseñas de médicos existentes si no están cifradas
            await Promise.all(
                medicosExistentes.map(async (medico) => {
                    if (!medico.password.startsWith('$2a$')) {
                        const hashedPassword = await bcrypt.hash(medico.password, 10);
                        medico.password = hashedPassword;
                        await medico.save();
                        console.log(`Contraseña de médico ${medico.nombres} actualizada a una versión cifrada.`);
                    }
                })
            );
        }
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

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al Sistema de Historial Médico');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
