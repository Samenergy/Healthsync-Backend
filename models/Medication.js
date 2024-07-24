// models/Medication.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Medication = sequelize.define("Medication", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  medicalRecordId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  medication: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

export { Medication };
