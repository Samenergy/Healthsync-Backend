export const up = async () => {
  const { queryInterface, Sequelize } = await import('../config/database.js');

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
};

export const down = async () => {
  const { queryInterface } = await import('../config/database.js');

  await queryInterface.removeColumn('Administrators', 'hospitalId');
  await queryInterface.removeColumn('Queues', 'hospitalId');
};
