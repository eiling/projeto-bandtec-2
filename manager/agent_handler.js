'use strict';

const AgentState = require('./agent_state');
const Util = require('./util');
const models = require('./sql/models');

function authenticateUser(protocol, username, password, agentId, agentName, agents, socket) {
  Util.authenticate(username, password).then(user => {
    if (user) {
      models.Agent.findOne({
        where: {
          id: agentId,
          userId: user.id,
        },
      }).then(agent => {
        if (agent) {
          protocol.send({
            type: 0,
            content: {
              id: agent.id,
            },
          });

          agents.push(
            new AgentState(
              user.id,
              agent.id,
              agent.name,
              agent.interval,
              agent.cpu,
              agent.memory,
              agent.disk,
              user.discordId,
              socket
            ).start()
          );
        } else {  // agent not found
          models.Agent.build({
            name: agentName,
            interval: 1000,
            cpu: -101,
            memory: -101,
            disk: -101,
            userId: user.id,
          }).save().then(agent => {
            protocol.send({
              type: 0,
              content: {
                id: agent.id,
              },
            });

            agents.push(
              new AgentState(
                user.id,
                agent.id,
                agent.name,
                agent.interval,
                agent.cpu,
                agent.memory,
                agent.disk,
                user.discordId,
                socket
              ).start()
            );
          });
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