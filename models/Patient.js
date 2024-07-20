import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate a UUID
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    dob: { type: DataTypes.DATE, allowNull: false },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },

    bloodtype: { type: DataTypes.STRING, allowNull: true },

    contact: { type: DataTypes.STRING, allowNull:false },
    emergencyContact: { type: DataTypes.STRING },

    allergies: { type: DataTypes.TEXT, allowNull: true },


    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Include timestamps for createdAt and updatedAt
  }
);

export { Patient };
