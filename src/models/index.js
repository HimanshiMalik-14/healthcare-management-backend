const sequelize = require('../config/db');
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Mapping = require('./Mapping');

// User associations
User.hasMany(Patient, { foreignKey: 'createdBy', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Doctor, { foreignKey: 'createdBy', as: 'doctors' });
Doctor.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Many-to-Many Patient <-> Doctor through Mapping
Patient.belongsToMany(Doctor, {
  through: Mapping,
  foreignKey: 'patientId',
  otherKey: 'doctorId',
  as: 'doctors',
  onDelete: 'CASCADE',
});

Doctor.belongsToMany(Patient, {
  through: Mapping,
  foreignKey: 'doctorId',
  otherKey: 'patientId',
  as: 'patients',
  onDelete: 'CASCADE',
});

// Mapping direct associations
Mapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient', onDelete: 'CASCADE' });
Mapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor', onDelete: 'CASCADE' });
Patient.hasMany(Mapping, { foreignKey: 'patientId', as: 'mappings', onDelete: 'CASCADE' });
Doctor.hasMany(Mapping, { foreignKey: 'doctorId', as: 'mappings', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  Mapping,
};
