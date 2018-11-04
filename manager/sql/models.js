'use strict';

const sequelize = require('../secrets/connection');

const User = sequelize.import(__dirname + '\\models\\user.js');
const Computer = sequelize.import(__dirname + '\\models\\computer.js');

User.hasMany(Computer);

module.exports = {
  sequelize,
  User,
  Computer,
};