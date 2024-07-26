import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Queue = sequelize.define(
  "Queue",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4().slice(0, 6), // Generate a UUID and slice the first 6 characters
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Patients",
        key: "id",
      },
    },
    doctor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assurance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    services: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("services");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("services", JSON.stringify(value));
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "waiting", // Possible values: 'waiting', 'in-progress', 'completed'
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Hospitals",
        key: "hospitalId",
      },
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Doctors", // Ensure this matches the actual model name
        key: "doctorId", // This should match the primary key field in the Doctors model
      },
    },
    amounts: {
      type: DataTypes.TEXT, // Change to TEXT for MySQL compatibility
      allowNull: true,
      defaultValue: JSON.stringify({
        Patient: "",
        Assurance: "",
      }),
      get() {
        const rawValue = this.getDataValue("amounts");
        return rawValue ? JSON.parse(rawValue) : { Patient: "", Assurance: "" };
      },
      set(value) {
        this.setDataValue("amounts", JSON.stringify(value));
      },
    },
  },
  {
    timestamps: true,
  }
);

Queue.associate = (models) => {
  Queue.belongsTo(models.Patient, { foreignKey: "patientId" });
  Queue.belongsTo(models.Hospital, { foreignKey: "hospitalId" });
  Queue.belongsTo(models.Doctor, { foreignKey: "doctorId" }); // Ensure Doctor model is imported and associated correctly
};

export default Queue;
