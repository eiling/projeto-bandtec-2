'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'eagledb',
  'eagle',
  'eagle',
  {
    host: '35.192.159.83',
    dialect: 'mysql',
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  discordId: {
    type: Sequelize.STRING,
  },
});

module.exports = {
  User,
};
