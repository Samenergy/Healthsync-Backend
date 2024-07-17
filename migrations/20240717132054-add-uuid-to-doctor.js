import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Ensure this path is correct

export async function up(queryInterface) {
  await queryInterface.addColumn('Doctors', 'id', {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4().slice(0, 6),  // Generate a UUID and slice the first 6 characters
    primaryKey: true,
  });
  await queryInterface.removeColumn('Doctors', 'id');  // Remove the integer ID column if needed
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Doctors');
}
