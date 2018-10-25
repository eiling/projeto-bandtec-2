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

sequelize  // needed?
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.import(__dirname + '\\models\\user.js');

sequelize.sync({force: true});

// module.exports = {
//   User,
// };
