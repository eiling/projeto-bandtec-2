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

function queryLastData(protocol, userId, agents){
  const agent = agents.find(e => e.id === userId);
  
  if (agent) {
    protocol.send({
      type: 0,
      content: agent.getLast(),
    });
  } else {
    protocol.send({
      type: 1,
      content: {},
    });
  }
}

function setupDiscordDm(protocol, userId, userTag){
  models.User.findById(userId).then(user => {
    const botSocket = new net.Socket();
    botSocket.connect(12000, 'localhost', () => {
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
      }).init().send({
        type: 0,
        content: {
          tag: userTag,
        },
      });
    });
  });
}

function registerAgent(protocol, userId, ){
}

module.exports = {
  authenticateUser,
  signUp,
  queryLastData,
  setupDiscordDm,
  registerAgent,
};