module.exports = {
  up: async (queryInterface, Sequelize) => {
      // Eliminar la clave foránea de Patients
      await queryInterface.removeConstraint('Cita', 'Cita_pacienteId_fkey');

      // Agregar la clave foránea correcta a Users
      await queryInterface.addConstraint('Cita', {
          fields: ['pacienteId'],
          type: 'foreign key',
          name: 'Cita_pacienteId_fkey',
          references: {
              table: 'Users',
              field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      });
  },
  down: async (queryInterface, Sequelize) => {
      // Revertir el cambio si es necesario
      await queryInterface.removeConstraint('Cita', 'Cita_pacienteId_fkey');
      await queryInterface.addConstraint('Cita', {
          fields: ['pacienteId'],
          type: 'foreign key',
          name: 'Cita_pacienteId_fkey',
          references: {
              table: 'Patients',
              field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      });
  },
};
