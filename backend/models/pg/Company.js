const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subscriptionPlan: {
    type: DataTypes.ENUM({
      values: ['free', 'premium'],
      name: 'subscription_plan_enum',
    }),
    allowNull: false,
    defaultValue: 'free',
  },
  paymentStatus: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
  },
}, {
  tableName: 'companies',
  freezeTableName: true,
  timestamps: true,
});

module.exports = Company;
