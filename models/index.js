import sequelize from "../config/database.js";
import Hospital from "./hospital.js";
import Administrator from "./administrator.js";
import Doctor from "./Doctor.js";
import Nurse from "./Nurse.js";
import Receptionist from "./Receptionist.js";
import Cashier from "./Cashier.js";
import Queue from "./queue.js";
import { Patient } from "./Patient.js";
import { MedicalRecord } from "./MedicalRecord.js";
import { Medication } from './Medication.js';
import { MedicalRecordImage } from './MedicalRecordImage.js';
import { setupAssociations } from "./associations.js";
// Define models
const models = {
  Hospital,
  Administrator,
  Doctor,
  Nurse,
  Receptionist,
  Cashier,
  Queue,
  Patient,
  MedicalRecord,
  Medication,
  MedicalRecordImage,
};
setupAssociations();
Patient.hasMany(MedicalRecord, { foreignKey: "patientId" });
MedicalRecord.belongsTo(Patient, { foreignKey: "patientId" });
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

(async () => {
  try {
    await sequelize.sync({ alter: true }); // Use `alter: true` to update the schema
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

export { models };
