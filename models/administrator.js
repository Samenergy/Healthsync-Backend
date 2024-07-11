import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from "bcrypt";

const Administrator = sequelize.define(
  "Administrator",
  {
    adminId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: "hospitalId" },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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

Administrator.associate = (models) => {
  Administrator.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

Administrator.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Administrator.beforeCreate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

export default Administrator;
