import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';

const Nurse = sequelize.define(
  'Nurse',
  {
    nurseId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: 'hospitalId' },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    field: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Nurse.associate = (models) => {
  Nurse.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Nurse.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Nurse.beforeCreate(async (nurse) => {
  if (nurse.password) {
    nurse.password = await bcrypt.hash(nurse.password, 10);
  }
});

export default Nurse;
