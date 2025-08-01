const User = require('./user.model');
const Position = require('./position.model');
const Team = require('./team.model');
const Player = require('./player.model');
const TechnicalDirector = require('./technicalDirector.model'); 

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

Team.belongsTo(TechnicalDirector, {
  foreignKey: 'technical_director_id',
  as: 'technicalDirector', 
  onDelete: 'SET NULL'
});

TechnicalDirector.hasOne(Team, {
  foreignKey: 'technical_director_id', 
  as: 'coachedTeam'
});

module.exports = {
  User,
  Position,
  Team,
  Player,
  TechnicalDirector
};