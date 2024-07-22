// models/MedicalRecordImage.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const MedicalRecordImage = sequelize.define('MedicalRecordImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  medicalRecordId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export { MedicalRecordImage };
