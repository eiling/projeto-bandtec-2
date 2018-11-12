'use strict';

const net = require('net');

const Protocol = require('./protocol/protocol');
const Util = require('./util');
const models = require('./sql/models');

function authenticateUser(protocol, username, password) {
  Util.authenticate(username, password).then(user => {
    if (user) {
      protocol.send({
        type: 0,
        content: {
          id: user.id,
        },
      });
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

function signUp(protocol, name, username, password) {
  models.User.build({
    name: name,
    username: username,
    password: password,
  }).save().then(user => {
    protocol.send({
      type: 0,
      content: {
        id: user.id,
      },
    });
  }).catch(reason => {
    protocol.send({
      type: 1,
      content: {
        message: reason.name,
      },
    });
  });
}

function queryLastData(protocol, userId, agentId, agents) {
  models.Agent.findOne({
    where: {
      id: agentId,
      userId: userId,
    },
  }).then(agent => {
    if (agent) {
      const agent = agents.find(e => e.agentId === agentId);

      if (agent) {
        protocol.send({
          type: 0,
          content: agent.getLast(),
        });
      } else {
        protocol.send({
          type: 1,
          content: {
            message: 'Agent not connected',
          },
        });
      }
    } else {
      protocol.send({
        type: 2,
        content: {
          message: 'Agent not registered.',
        },
      });
    }
  });
}

function setupDiscordDm(protocol, userId, userTag) {
  models.User.findById(userId).then(user => {
    const botSocket = new net.Socket();
    botSocket.connect(10000, 'localhost', () => {
      new Protocol(botSocket, response => {
        if (response.type === 0) {
          user.discordId = response.content.discordId;
          user.save().then(() => {
            protocol.send({
              type: 0,
              content: {
                discordId: response.content.discordId,
              },
            });
            console.log('SAVED');
          }).catch(reason => {
            protocol.send({
              type: 1,
              content: {
                message: 'Error in setupDiscordDm() [MANAGER] - ' + reason.name,
              },
            });
            console.log('ERROR - ' + reason.name);
          });
        } else {
          protocol.send(response);  // change this later
          console.log('ERROR');
        }

        botSocket.end();
      }).init().send({
        type: 0,
        content: {
          tag: userTag,
        },
      });
    });
  });
}

function getAgents(protocol, userId, agents) {
  models.Agent.findAll({
    where: {
      userId: userId,
    },
  }).then(registeredAgents => {
    const connected = agents.filter(e => e.userId === userId);

    const registered = [];

    for (let i of registeredAgents) {
      registered.push({
        id: i.id,
        name: i.name,

        connected: false,
      });
    }
    for (let i of registered) {
      if (connected.find(e => e.agentId === i.id)) {
        i.connected = true;
      }
    }

    protocol.send({
      type: 0,
      content: {
        agents: registered,
      }
    });
  });
}

function getAgent(protocol, userId, agentId) {
  models.Agent.findOne({
    where: {
      id: agentId,
      userId: userId,
    }
  }).then(agent => {
    if (agent) {
      protocol.send({
        type: 0,
        content: {
          agent: agent,
        },
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Error in getAgent()',
        },
      });
    }
  });
}

function sendPing(protocol, userId) {
  models.User.findById(userId).then(user => {
    if (user) {
      if (user.discordId) {
        const socket = new net.Socket();
        socket.connect(10000, 'localhost', () => {
          new Protocol(socket, response => {
            protocol.send(response);

            socket.end();
          }).init().send({
            type: 1,
            content: {
              id: user.discordId,
            },
          });
        });
      } else {
        protocol.send({
          type: 1,
          content: {
            message: 'Discord ID not registered'
          }
        })
      }
    } else {
      protocol.send({
        type: 2,
        content: {
          message: 'User not found. HOW DID THIS HAPPEN???'
        }
      })
    }
  });
}

function changeAgentParams(protocol, agentParams, userId, agents) {
  models.Agent.findOne({
    where: {
      id: agentParams.id,
      userId: userId,
    },
  }).then(agent => {
    if (agent) {
      if (agentParams.name) {
        agent.name = agentParams.name;
      }
      if (agentParams.interval) {
        agent.interval = agentParams.interval;
      }
      if (agentParams.cpu) {
        agent.cpu = agentParams.cpu;
      }
      if (agentParams.memory) {
        agent.memory = agentParams.memory;
      }
      if (agentParams.disk) {
        agent.disk = agentParams.disk;
      }

      agent.save().then(() => {
        const agentState = agents.find(e => e.agentId === agentParams.id);

        if (agentState) {
          if (agentParams.name) {
            agentState.name = agentParams.name;
          }
          if (agentParams.interval) {
            agentState.interval = agentParams.interval;
          }
          if (agentParams.cpu) {
            agentState.cpu = agentParams.cpu;
          }
          if (agentParams.memory) {
            agentState.memory = agentParams.memory;
          }
          if (agentParams.disk) {
            agentState.disk = agentParams.disk;
          }
        }

        protocol.send({
          type: 0,
          content: {},
        });
      }).catch(err => {
        protocol.send({
          type: 2,
          content: {
            message: 'Error updating agent - changeAgentParams(); err: ' + err,
          }
        });
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Agent not found -- changeAgentParams()'
        },
      });
    }
  });
}

function removeAgent(protocol, userId, agentId, agents) {
  models.Agent.destroy({
    where: {
      id: agentId,
      userId: userId,
    },
  }).then(count => {
    if (count === 1) {
      const index = agents.findIndex(e => e.agentId === agentId);
      if (index !== -1) {
        agents[index].stop();
        agents.splice(index, 1);
      }

      protocol.send({
        type: 0,
        content: {},
      });
    } else {
      protocol.send({
        type: 2,
        content: {
          message: 'Deleted rows count: ' + count,
        },
      });
    }
  }).catch(err => {
    protocol.send({
      type: 0,
      content: {
        message: err.toString(),
      },
    });
  });
}

module.exports = {
  authenticateUser,
  signUp,
  queryLastData,
  setupDiscordDm,
  getAgents,
  getAgent,
  sendPing,
  changeAgentParams,
  removeAgent,
};