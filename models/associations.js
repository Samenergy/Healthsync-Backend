import { Patient } from './Patient.js';
import { MedicalRecord } from './MedicalRecord.js';
import { Medication } from './Medication.js';
import { MedicalRecordImage } from './MedicalRecordImage.js';

function setupAssociations() {
  MedicalRecord.hasMany(Medication, { foreignKey: 'medicalRecordId', onDelete: 'CASCADE' });
  Medication.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId' });

  MedicalRecord.hasMany(MedicalRecordImage, { foreignKey: 'medicalRecordId', onDelete: 'CASCADE' });
  MedicalRecordImage.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId' });

  Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', onDelete: 'CASCADE' });
  MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId' });
}

export { setupAssociations };
