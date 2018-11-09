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

    const unregistered = [];

    for (let i of connected.filter(e => e.agentId <= -1)) {
      unregistered.push({
        id: i.agentId,
        name: i.name,
      });
    }

    protocol.send({
      type: 0,
      content: {
        registered: registered,
        unregistered: unregistered,
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

function registerAgent(protocol, name, interval, cpu, memory, disc, userId, agentTempId, agents){
  const ua = agents.find(e => e.agentId === agentTempId);

  models.Agent.build({
    name: name || ua.name,
    interval: interval,
    cpu: cpu,
    memory: memory,
    disc: disc,
    userId: userId
  }).save().then(agent => {
    ua.name = name;
    ua.agentId = agent.id;
    // update interval and parameters too

    ua.send({
      type: 1,
      content: {
        id: agent.id,
      },
    });

    protocol.send({
      type: 0,
      content: {},
    });
  });
}

function getUnregisteredAgent(protocol, userId, agentId, agents){
  const agent = agents.find(e => e.userId === userId && e.agentId === agentId);
  if (agent){
    protocol.send({
      type: 0,
      content: {
        agent: {
          name: agent.name,
          id: agent.agentId,
        },
      },
    });
  } else{
    protocol.send({
      type: 1,
      content: {
        message: 'Couldn\'t find agent in getUnregisteredAgent',
      },
    });
  }
}

module.exports = {
  authenticateUser,
  signUp,
  queryLastData,
  setupDiscordDm,
  getAgents,
  getAgent,
  sendPing,
  registerAgent,
  getUnregisteredAgent,
};