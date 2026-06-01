const Company = require('./Company');
const User = require('./User');
const Container = require('./Container');
const Task = require('./Task');
const Utilizer = require('./Utilizer');

Company.hasMany(User, { foreignKey: 'companyId', as: 'users' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Company.hasMany(Container, { foreignKey: 'companyId', as: 'containers' });
Container.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Company.hasMany(Task, { foreignKey: 'companyId', as: 'tasks' });
Task.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.belongsTo(Utilizer, {
  foreignKey: 'stationId',
  targetKey: 'stationId',
  as: 'station',
});
Utilizer.hasOne(User, {
  foreignKey: 'stationId',
  sourceKey: 'stationId',
  as: 'utilizerUser',
});

module.exports = { Company, User, Container, Task, Utilizer };
