import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Queue = sequelize.define(
  'Queue',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4().slice(0, 6),  // Generate a UUID and slice the first 6 characters
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id',
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
    status: {
      type: DataTypes.STRING,
      defaultValue: 'waiting',  // Possible values: 'waiting', 'in-progress', 'completed'
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Hospitals',
        key: 'hospitalId',
      },
    },
  },
  {
    timestamps: true,
  }
);

Queue.associate = (models) => {
  Queue.belongsTo(models.Patient, { foreignKey: 'patientId' });
  Queue.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
  Queue.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
};

export default Queue;
