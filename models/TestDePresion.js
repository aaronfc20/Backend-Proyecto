const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').getConnection();  // Usamos getConnection para obtener la instancia de Sequelize

const TestDePresion = sequelize.define('TestDePresion', {
  respuestas: {
    type: DataTypes.ARRAY(DataTypes.STRING),  // Si usas PostgreSQL, ARRAY es válido
    allowNull: false
  },
  probabilidadDepresion: {
    type: DataTypes.STRING,  // Baja, Media o Alta
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // La fecha se establece automáticamente
    allowNull: false
  },
});

module.exports = TestDePresion;
