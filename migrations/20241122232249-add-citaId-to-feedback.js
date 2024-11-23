module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Feedback', 'citaId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Cita', // Nombre de la tabla a la que hace referencia
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Feedback', 'citaId');
  },
};
