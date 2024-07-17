import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Hospital = sequelize.define(
  "Hospital",
  {
    hospitalId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hospitalName: DataTypes.STRING,
    address: DataTypes.STRING,
    facilityType: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true, // Ensure email is unique
    },
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
  {
    timestamps: true,
  }
);

Hospital.associate = (models) => {
  Hospital.hasMany(models.Administrator, { foreignKey: "hospitalId" });
  Hospital.hasMany(models.Doctor, { foreignKey: "hospitalId" });
  Hospital.hasMany(models.Nurse, { foreignKey: "hospitalId" });
  Hospital.hasMany(models.Receptionist, { foreignKey: "hospitalId" });
  Hospital.hasMany(models.Cashier, { foreignKey: "hospitalId" });
  Hospital.hasMany(models.Queue, { foreignKey: "hospitalId" });
};

export default Hospital;
