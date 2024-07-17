import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const Doctor = sequelize.define(
  "Doctor",
  {
    doctorId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4().slice(0, 6), // Generate a UUID and slice the first 6 characters
      primaryKey: true,
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: { model: Hospital, key: "hospitalId" },
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure email is unique
    },
    phoneNumber: DataTypes.STRING,
    specialization: DataTypes.STRING,
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

Doctor.associate = (models) => {
  Doctor.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

Doctor.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Doctor;
