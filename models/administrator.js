import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';

const Administrator = sequelize.define(
  'Administrator',
  {
    adminId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospitalId: {
      type: DataTypes.INTEGER,
      references: { model: Hospital, key: 'hospitalId' },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

Administrator.associate = (models) => {
  Administrator.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};

Administrator.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Hash password before saving
Administrator.beforeCreate((admin) => {
  if (admin.password) {
    admin.password = bcrypt.hashSync(admin.password, 10);
  }
});

export default Administrator;
