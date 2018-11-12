'use strict';

const models = require('./sql/models');

function authenticate(username, password) {
  return models.User.findOne({
    where: {
      username: username,
      password: password,
    },
  });
}

module.exports = {
  authenticate,
};