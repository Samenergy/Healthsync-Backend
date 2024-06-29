import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";

const Doctor = sequelize.define(
  "Doctor",
  {
    doctorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: "hospitalId" },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    specialization: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

Doctor.associate = (models) => {
  Doctor.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

export default Doctor;
