const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Conexión a la base de datos

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  paciente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pacientes', // Aquí debes poner el nombre de la tabla que contiene los pacientes, si está definida en tu base de datos
      key: 'id', // Columna de la tabla de pacientes que es la clave primaria
    }
  },
  horario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'horarios', // Se refiere a la tabla de horarios en la base de datos
      key: 'id', // Columna de la tabla de horarios que es la clave primaria
    }
  }
}, {
  tableName: 'reservas',
  timestamps: true, // Si quieres que Sequelize maneje las fechas de creación y actualización automáticamente
});

// Exportar el modelo para que pueda ser utilizado en otras partes del código
module.exports = Reserva;
