// src/models.js

import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false, // Turn off logging for production
});

// Define the Patient model
const Patient = sequelize.define(
  "Patient",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    height: { type: DataTypes.STRING },
    weight: { type: DataTypes.STRING },
    bloodtype: { type: DataTypes.STRING },
    bmi: { type: DataTypes.DECIMAL(5, 1) },
    bloodPressure: { type: DataTypes.STRING },
    contact: { type: DataTypes.STRING },
    emergencyContact: { type: DataTypes.STRING },
    medicalHistory: { type: DataTypes.TEXT },
    medications: { type: DataTypes.TEXT },
    allergies: { type: DataTypes.TEXT },
    immunizations: { type: DataTypes.TEXT },
    currentHealthConditions: { type: DataTypes.STRING },
    labResults: { type: DataTypes.STRING },
    treatmentPlans: { type: DataTypes.TEXT },
    insurance: { type: DataTypes.STRING },
    socialHistory: { type: DataTypes.TEXT },
    consentForms: {
      type: DataTypes.ENUM("Signed", "Not Signed"),
      allowNull: false,
    },
    image: { type: DataTypes.BLOB("long") }, // Changed to 'long' for large binary data
  },
  {
    timestamps: false,
  }
);

export { sequelize, Patient };
