'use strict';

const sequelize = require('../secrets/connection');

const User = sequelize.import(__dirname + '\\models\\user.js');
const Computer = sequelize.import(__dirname + '\\models\\computer.js');
const History = sequelize.import(__dirname + '\\models\\history.js');

Computer.hasMany(History, {foreignKey: 'id_computer'});
User.hasMany(Computer, {foreignKey: 'id_user'});

module.exports = {
  sequelize,
  User,
  Computer,
};