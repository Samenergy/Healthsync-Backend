import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Patient } from './Patient.js';

const Queue = sequelize.define('Queue', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  doctor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assurance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'waiting', // Possible values: 'waiting', 'in-progress', 'completed'
    allowNull: false
  },
  hospitalId: {  // Added foreign key for the hospital
    type: DataTypes.INTEGER,
    references: {
      model: 'Hospitals',  // The model name should be pluralized if that’s how you defined it
      key: 'hospitalId'
    },
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'queues'
});

Queue.associate = (models) => {
  Queue.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Queue.belongsTo(Patient, { foreignKey: 'patientId' });
Patient.hasMany(Queue, { foreignKey: 'patientId' });

export default Queue;
