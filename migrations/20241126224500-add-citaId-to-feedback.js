module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Feedback', 'citaId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Permitir valores nulos temporalmente
      references: {
        model: 'Cita', // Nombre exacto de la tabla relacionada
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Feedback', 'citaId');
  },
};
