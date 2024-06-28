import Hospital from './hospital.js';
import Doctor from './Doctor.js';
import Nurse from './Nurse.js';
import Receptionist from './Receptionist.js';
import Cashier from './Cashier.js';

// Associations
Hospital.hasMany(Doctor, { foreignKey: 'hospitalId' });
Doctor.belongsTo(Hospital, { foreignKey: 'hospitalId' });

Hospital.hasMany(Nurse, { foreignKey: 'hospitalId' });
Nurse.belongsTo(Hospital, { foreignKey: 'hospitalId' });

Hospital.hasMany(Receptionist, { foreignKey: 'hospitalId' });
Receptionist.belongsTo(Hospital, { foreignKey: 'hospitalId' });

Hospital.hasMany(Cashier, { foreignKey: 'hospitalId' });
Cashier.belongsTo(Hospital, { foreignKey: 'hospitalId' });
