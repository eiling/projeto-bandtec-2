'use strict';

const AgentState = require('./agent_state');
const Util = require('./util');

function authenticateUser(protocol, username, password, agents, socket) {
  Util.authenticate(username, password).then(user => {
    if (user) {
      protocol.send({
        type: 0,
        content: {
          id: user.id,
        },
      });

      agents.push(new AgentState(user.id, socket).start());
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Error in authenticate Promise',
        },
      });
    }
  });
}

module.exports = {
  authenticateUser,
};