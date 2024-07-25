// models/MedicalRecord.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const MedicalRecord = sequelize.define(
  "MedicalRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false, 
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false, 
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false, 
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true, 
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true, 
    },
    bmi: {
      type: DataTypes.FLOAT,
      allowNull: true, 
    },
    bloodPressure: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    immunizations: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    insurance: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  
    socialHistory: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    doctorname: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
    Hospitalname: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
  },
  {
    timestamps: true,
  }
);

export { MedicalRecord };
