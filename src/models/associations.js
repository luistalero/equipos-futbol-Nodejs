const { sequelize } = require('../config/db');

const User = require('./user.model')(sequelize);
const Position = require('./position.model')(sequelize);
const Team = require('./team.model')(sequelize);
const Player = require('./player.model')(sequelize);
const TechnicalDirector = require('./technicalDirector.model')(sequelize); 
const LoginLog = require('./LoginLog.model')(sequelize);

Team.hasMany(Player, {
  foreignKey: 'team_id',
  as: 'players', 
  onDelete: 'CASCADE' 
});

Player.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team' 
});

Position.hasMany(Player, {
  foreignKey: 'position_id',
  as: 'players',
  onDelete: 'SET NULL' 
});

Player.belongsTo(Position, {
  foreignKey: 'position_id',
  as: 'position'
});

Team.hasOne(TechnicalDirector, {
  foreignKey: 'team_id',
  as: 'technicalDirector', 
  onDelete: 'SET NULL'
});

TechnicalDirector.belongsTo(Team, {
  foreignKey: 'team_id',
  as: 'team'
});

User.hasMany(LoginLog, {
  foreignKey: 'userId',
  as: 'loginLogs',
  onDelete: 'CASCADE'
});

LoginLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Position,
  Team,
  Player,
  TechnicalDirector,
  LoginLog
};