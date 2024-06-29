import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from 'bcrypt';
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
    field: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

Nurse.associate = (models) => {
  Nurse.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};
Nurse.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Hash password before saving
Nurse.beforeCreate((nurse) => {
  if (nurse.password) {
    nurse.password = bcrypt.hashSync(nurse.password, 10);
  }
});
export default Nurse;
