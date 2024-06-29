import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Hospital = sequelize.define(
  'Hospital',
  {
    hospitalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {}
);

Hospital.associate = (models) => {
  Hospital.hasMany(models.Administrator, { foreignKey: 'hospitalId' });
  Hospital.hasMany(models.Doctor, { foreignKey: 'hospitalId' });
  Hospital.hasMany(models.Nurse, { foreignKey: 'hospitalId' });
  Hospital.hasMany(models.Receptionist, { foreignKey: 'hospitalId' });
  Hospital.hasMany(models.Cashier, { foreignKey: 'hospitalId' });
};

export default Hospital;
