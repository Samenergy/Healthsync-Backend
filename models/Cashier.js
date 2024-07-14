import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from "bcrypt";

const Cashier = sequelize.define(
  "Cashier",
  {
    cashierId: {
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

Cashier.associate = (models) => {
  Cashier.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};
Cashier.beforeCreate(async (cashier) => {
  if (cashier.password) {
    cashier.password = await bcrypt.hash(cashier.password, 10);
  }
});
Cashier.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default Cashier;
