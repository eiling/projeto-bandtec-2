'use strict';

const AgentState = require('./agent_state');
const Util = require('./util');
const models = require('./sql/models');

function authenticateUser(protocol, username, password, agentId, agents, socket) {
  Util.authenticate(username, password).then(user => {
    if (user) {
      models.Agent.findOne({
        where: {
          id: agentId,
          userId: user.id,
        },
      }).then(agent => {
        if(agent){
          protocol.send({
            type: 0,
            content: {
              id: agent.id,
            },
          });

          agents.push(new AgentState(user.id, agent.id, socket).start());
        } else{  // agent not found
          protocol.send({
            type: 0,
            content: {
              id: -1,
            },
          });

          agents.push(new AgentState(user.id, Util.getUnregisteredId(user.id, agents), socket).start());
        }
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Error in authenticate Promise - User not found',
        },
      });
    }
  });
}

module.exports = {
  authenticateUser,
};