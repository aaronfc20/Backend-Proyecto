module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'Feedback', // Asegura que la tabla se llame 'Feedback'
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Cita, {
      foreignKey: 'citaId',
      onDelete: 'CASCADE',
    });
  };

  return Feedback;
};
