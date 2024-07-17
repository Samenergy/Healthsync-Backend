import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Patient = sequelize.define(
  'Patient',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),  // Generate a UUID
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
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
      type: DataTypes.ENUM('Signed', 'Not Signed'),
      allowNull: false,
    },
    image: { type: DataTypes.BLOB('long') }, // Changed to 'long' for large binary data
  },
  {
    timestamps: true, // Include timestamps for createdAt and updatedAt
  }
);

export { Patient };
