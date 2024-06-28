import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';
import Hospital from './hospital.js';

const Receptionist = sequelize.define('Receptionist', {
  receptionistId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospitalId: { type: DataTypes.INTEGER, references: { model: Hospital, key: 'hospitalId' } },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
}, {
  timestamps: true,
});

Receptionist.associate = (models) => {
  Receptionist.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

export default Receptionist;
