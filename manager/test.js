const Sequelize = require('sequelize');
const sequelize = require('./secrets/connection');

const User = sequelize.define('testuser', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
});
const Agent = sequelize.define('agent', {
  field1: {
    type: Sequelize.STRING,
  },
  field2: {
    type: Sequelize.STRING,
  },
});

User.hasMany(Agent);

sequelize.sync({force: true}).then(() => {
  console.log('done')
});
