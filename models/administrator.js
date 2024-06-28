import { DataTypes } from 'sequelize';
import sequelize from '../configs/database.js';
import Hospital from './hospital.js';
import bcrypt from 'bcrypt';
const Administrator = sequelize.define('Administrator', {
  adminId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hospitalId: { type: DataTypes.INTEGER, references: { model: Hospital, key: 'hospitalId' } },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  timestamps: true,
});

Administrator.associate = (models) => {
  Administrator.belongsTo(models.Hospital, { foreignKey: 'hospitalId' });
};
Administrator.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
export default Administrator;
