module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Administrators', 'hospitalId', {
      type: Sequelize.UUID,
      references: {
        model: 'Hospitals',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('Queues', 'hospitalId', {
      type: Sequelize.UUID,
      references: {
        model: 'Hospitals',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Administrators', 'hospitalId');
    await queryInterface.removeColumn('Queues', 'hospitalId');
  },
};
