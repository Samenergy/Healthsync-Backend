import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';

const Receptionist = sequelize.define(
  'Receptionist',
  {
    receptionistId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: 'hospitalId' },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsibilities: DataTypes.TEXT, // New field for responsibilities
  },
  {
    timestamps: true,
  }
);

Receptionist.associate = (models) => {
  Receptionist.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Receptionist.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Receptionist.beforeCreate(async (receptionist) => {
  if (receptionist.password) {
    receptionist.password = await bcrypt.hash(receptionist.password, 10);
  }
});

export default Receptionist;
