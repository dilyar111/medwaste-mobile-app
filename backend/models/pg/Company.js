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
    // Backed by the PostgreSQL subscription_plan_enum type from migrations.
    // Keep Sequelize from generating a duplicate enum_companies_subscriptionPlan type.
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'free',
    validate: {
      isIn: [['free', 'premium']],
    },
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
