'use strict';

const sequelize = require('../secrets/connection');

const User = sequelize.import(__dirname + '\\models\\user.js');
const Agent = sequelize.import(__dirname + '\\models\\agent.js');

User.hasMany(Agent, {foreignKey: 'userId', onDelete: 'CASCADE',});

module.exports = {
  sequelize,
  User,
  Agent,
};