"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add hospitalId column to Queue table
    await queryInterface.addColumn("Queues", "hospitalId", {
      type: Sequelize.UUID,
      references: {
        model: "Hospitals",
        key: "hospitalId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Update the patientId column in the Queue table to reference Patients model correctly
    await queryInterface.changeColumn("Queues", "patientId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Patients",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove hospitalId column from Queue table
    await queryInterface.removeColumn("Queues", "hospitalId");

    // Revert the patientId column in the Queue table
    await queryInterface.changeColumn("Queues", "patientId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Patients",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },
};
