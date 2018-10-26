'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

const User = sequelize.import(__dirname + '\\models\\user.js');
const Computer = sequelize.import(__dirname + '\\models\\computer.js');
const History = sequelize.import(__dirname + '\\models\\history.js');

Computer.hasMany(History, {foreignKey:'id_computer'});
User.hasMany(Computer, {foreignKey: 'id_user'});

sequelize.sync({force: true}).then(() => User.build({
  name: 'Bianca',
  username: 'bianca',
  password: 'bianca',
  discordId: 'ID',
}).save().then(() => console.log('criado')));
