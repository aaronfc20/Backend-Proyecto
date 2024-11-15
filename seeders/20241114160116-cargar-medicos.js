// seeders/cargarMedicos.js
const bcrypt = require('bcryptjs');
const Medico = require('../models/Médico');
const medicosData = require('../data/medicos.json');

module.exports = {
    up: async () => {
        try {
            for (const medico of medicosData) {
                // Generar el correo electrónico: nombre + apellido + @gmail.com
                medico.correoElectronico = `${medico.nombres.toLowerCase()}${medico.apellidoPaterno.toLowerCase()}@gmail.com`;
                
                // Cifrar la contraseña "123"
                medico.password = await bcrypt.hash('123', 10);
            }

            await Medico.bulkCreate(medicosData);
            console.log('Médicos cargados correctamente en la base de datos con correos y contraseñas.');
        } catch (error) {
            console.error('Error al cargar los médicos:', error);
        }
    },

    down: async () => {
        try {
            await Medico.destroy({ where: {}, truncate: true });
            console.log('Médicos eliminados correctamente de la base de datos.');
        } catch (error) {
            console.error('Error al eliminar los médicos:', error);
        }
    }
};
