import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";

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
Cashier.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
Cashier.beforeCreate(async (cashier) => {
  if (cashier.password) {
    cashier.password = await bcrypt.hash(cashier.password, 10);
  }
});


export default Cashier;
