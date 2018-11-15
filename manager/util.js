'use strict';

const net = require('net');

const Protocol = require('./protocol/protocol');
const models = require('./sql/models');

function authenticate(username, password) {
  return models.User.findOne({
    where: {
      username: username,
      password: password,
    },
  });
}

function sendToBot(message, handler) {
  const socket = new net.Socket();
  socket.connect(10000, 'localhost', () => {
    new Protocol(socket, response => {
      handler(response);
      socket.end();
    }).init().send(message);
  });
}

function sendAlertToBot(userId, alertContent, handler) {
  models.User.findById(userId).then(user => {
    if (user) {
      sendToBot({
        type: 2,
        content: {
          id: user.discordId,
          alertContent: alertContent,
        },
      }, handler);
    } else {
      console.log('User not found -- sendAlertToBot()');  // can this actually happen?
    }
  })
}

module.exports = {
  authenticate,
  sendToBot,
  sendAlertToBot,
};