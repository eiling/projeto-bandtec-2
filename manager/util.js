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

function getUnregisteredId(userId, agents) {
  let id = 0;
  agents.filter(e => e.userId === userId).forEach(e => {
    if (e.agentId < id) {
      id = e.agentId;
    }
  });
  return id - 1;
}

module.exports = {
  authenticate,
  getUnregisteredId,
};