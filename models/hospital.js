import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';

const Hospital = sequelize.define('Hospital', {
  hospitalId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospitalName: DataTypes.STRING,
  address: DataTypes.STRING,
  facilityType: DataTypes.STRING,
  email: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  taxIdNumber: DataTypes.STRING,
  businessRegistrationNumber: DataTypes.STRING,
  country: DataTypes.STRING,
  province: DataTypes.STRING,
  district: DataTypes.STRING,
  sector: DataTypes.STRING,
  logo: DataTypes.STRING,
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Add createdAt field
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Add updatedAt field
}, {});

Hospital.associate = (models) => {
  Hospital.hasMany(models.Administrator, { foreignKey: 'hospitalId' });
};

export default Hospital;
