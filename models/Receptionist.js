import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from 'bcrypt';
const Receptionist = sequelize.define(
  "Receptionist",
  {
    receptionistId: {
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
    password: DataTypes.STRING,
    responsibilities: DataTypes.TEXT, // New field for responsibilities
  },
  {
    timestamps: true,
  }
);

Receptionist.associate = (models) => {
  Receptionist.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

Receptionist.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Hash password before saving
Receptionist.beforeCreate((receptionist) => {
  if (receptionist.password) {
    receptionist.password = bcrypt.hashSync(receptionist.password, 10);
  }
});

export default Receptionist;
