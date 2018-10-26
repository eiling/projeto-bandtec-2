'use strict';

const AgentState = require('./agent_state');
const Util = require('./util');

function authenticateUser(protocol, username, password, agents, socket) {
  const id = Util.authenticate(username, password);
  if (id !== 'NULL') {
    protocol.send({
      type: 0,
      content: {
        id: id,
      },
    });
    agents.push(new AgentState(id, socket).start());
  } else {
    protocol.send({
      type: 1,
      content: {},
    });
  }
}

module.exports = Object.freeze({
  authenticateUser,
});