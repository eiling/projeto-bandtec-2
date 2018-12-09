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
  models.Agent.find({
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
          content: agent.get(),
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
    Util.sendToBot({
      type: 0,
      content: {
        tag: userTag,
      },
    }, response => {
      if (response.type === 0) {
        user.discordId = response.content.discordId;
        user.save().then(() => {
          protocol.send({
            type: 0,
            content: {
              discordId: response.content.discordId,
            },
          });
        }).catch(reason => {
          protocol.send({
            type: 1,
            content: {
              message: 'Error in setupDiscordDm() [MANAGER] - ' + reason.name,
            },
          });
        });
      } else {
        protocol.send(response);  // change this later
      }
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
  models.Agent.find({
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
        Util.sendToBot({
          type: 1,
          content: {
            id: user.discordId,
          },
        }, response => {
          protocol.send(response);
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
  models.Agent.find({
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

function getDiscordTag(protocol, userdId) {
  models.User.findById(userdId).then(user => {
    if (user.discordId) {
      Util.sendToBot({
        type: 3,
        content: {
          id: user.discordId,
        },
      }, response => {
        if (response.type === 0) {
          protocol.send({
            type: 0,
            content: {
              discordTag: response.content.discordTag,
            },
          });
        } else {
          protocol.send({
            type: 1,
            content: {
              message: response.content.message,
            },
          });
        }
      });
    } else {
      protocol.send({
        type: 2,
        textContent: {
          message: 'No Discord ID saved',
        },
      });
    }
  });
}

function removeDiscord(protocol, userId) {
  models.User.findById(userId).then(user => {
    user.discordId = null;
    user.save().then(() => {
      protocol.send({
        type: 0,
        content: {},
      });
    }).catch(err => {
      protocol.send({
        type: 1,
        content: {
          message: err.toString(),
        },
      });
    });
  }).catch(err => {
    protocol.send({
      type: 2,
      content: {
        message: err.toString(),
      },
    });
  });
}

function getUser(protocol, userId) {
  models.User.findById(userId).then(user => {
    protocol.send({
      type: 0,
      content: {
        user: user,
      },
    });
  }).catch(err => {
    protocol.send({
      type: 1,
      content: {
        message: err.toString(),
      },
    });
  });
}

function updateUser(protocol, userId, currentPassword, params) {
  models.User.findById(userId).then(user => {
    if (currentPassword === user.password) {
      if (params.name) {
        user.name = params.name;
      }
      if (params.username) {
        user.username = params.username;
      }
      if (params.password) {
        user.password = params.password;
      }

      user.save().then(() => {
        protocol.send({
          type: 0,
          content: {},
        });
      }).catch(err => {
        protocol.send({
          type: 2,
          content: {
            message: err.toString(),
          },
        });
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Incorrect password',
        },
      });
    }
  }).catch(err => {
    protocol.send({
      type: 3,
      content: {
        message: err.toString(),
      },
    });
  });
}

function getAgentRecords(protocol, userId, agentId, beginDate, endDate) {
  models.Agent.find({
    where: {
      id: agentId,
      userId: userId,
    }
  }).then(agent => {
    if (agent) {
      protocol.send({
        type: 0,
        content: {
          agentName: agent.name,
        },
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Error in getAgentRecords()',
        },
      });
    }
  });
}

function getLastAlerts(protocol, userId, agentId) {
  models.Agent.find({
    where: {
      id: agentId,
      userId: userId,
    }
  }).then(agent => {
    if (agent) {
      const date = new Date();
      date.setDate(date.getDate() - 7);

      models.Alert.findAll({
        where: {
          agentId: agent.id,
          endTime: {
            [models.Op.gte]: date.toISOString(),
          }
        },
        order: [['endTime', 'DESC']],
        limit: 5,
      }).then(alerts => {
        protocol.send({
          type: 0,
          content: {
            alerts: alerts,
          },
        });
      }).catch(err => {
        protocol.send({
          type: 3,
          content: {
            message: err.toString(),
          },
        });
      });
    } else {
      protocol.send({
        type: 1,
        content: {
          message: 'Agent not found',
        },
      });
    }
  }).catch(err => {
    protocol.send({
      type: 2,
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
  getDiscordTag,
  removeDiscord,
  getUser,
  updateUser,
  getAgentRecords,
  getLastAlerts,
};