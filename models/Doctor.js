import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from 'bcrypt';
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
    password: DataTypes.STRING,
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


Doctor.beforeCreate(async (doctor) => {
  if (doctor.password) {
    doctor.password = await bcrypt.hash(doctor.password, 10);
  }
});

export default Doctor;
