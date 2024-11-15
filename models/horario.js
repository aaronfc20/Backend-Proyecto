const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que la conexión esté configurada

const Horario = sequelize.define('Horario', {
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Los horarios estarán disponibles por defecto
    },
    medicoId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Medicos', // Asegúrate de que esta referencia coincida con el nombre de la tabla de médicos
            key: 'id',
        },
        allowNull: false,
    }
});

module.exports = Horario;
