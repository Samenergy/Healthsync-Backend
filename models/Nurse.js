import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";

const Nurse = sequelize.define(
  "Nurse",
  {
    nurseId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: "hospitalId" },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

Nurse.associate = (models) => {
  Nurse.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

export default Nurse;
