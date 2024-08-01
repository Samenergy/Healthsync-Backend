import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const Administrator = sequelize.define(
  "Administrator",
  {
    adminId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate a full UUID
      primaryKey: true,
    },
    hospitalId: {
      type: DataTypes.UUID,
      references: {
        model: Hospital,
        key: "hospitalId",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure email is unique
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

// Hash the password before saving to the database
Administrator.beforeCreate(async (admin) => {
  if (admin.password) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
});

// Compare passwords for authentication
Administrator.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Administrator.associate = (models) => {
  Administrator.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
};

export default Administrator;
