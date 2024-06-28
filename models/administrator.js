import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';
import Hospital from './hospital.js'; 

const Administrator = sequelize.define('Administrator', {
  adminId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospitalId: { type: DataTypes.INTEGER, references: { model: Hospital, key: 'hospitalId' } },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  timestamps: true, // Enable timestamps
});

Administrator.associate = (models) => {
  Administrator.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

export default Administrator;
