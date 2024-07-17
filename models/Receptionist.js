import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const Receptionist = sequelize.define(
  'Receptionist',
  {
    receptionistId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4().slice(0, 6), // Generate a UUID and slice the first 6 characters
      primaryKey: true,
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: { model: Hospital, key: 'hospitalId' },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure email is unique
    },
    phoneNumber: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsibilities: {
      type: DataTypes.TEXT, // New field for responsibilities
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Receptionist.associate = (models) => {
  Receptionist.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Receptionist.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Receptionist;
