import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const Nurse = sequelize.define(
  'Nurse',
  {
    nurseId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4().slice(0, 6), // Generate a UUID and slice the first 6 characters
      primaryKey: true,
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: { model: Hospital, key: 'hospitalId' },
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure email is unique
    },
    phoneNumber: DataTypes.STRING,
    field: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Nurse.associate = (models) => {
  Nurse.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Nurse.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Nurse;
