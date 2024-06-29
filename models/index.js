import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import Administrator from './administrator.js';
import Doctor from './Doctor.js';
import Nurse from './Nurse.js';
import Receptionist from './Receptionist.js';
import Cashier from './Cashier.js';

// Define models
const models = {
  Hospital,
  Administrator,
  Doctor,
  Nurse,
  Receptionist,
  Cashier
};

// Associate models
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Sync database
(async () => {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } if you want to drop and recreate tables
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

export { models };
