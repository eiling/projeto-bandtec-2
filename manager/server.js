'use strict';

const net = require('net');

const Protocol = require('./protocol/protocol');
const AgentHandler = require('./agent_handler');
const WebappHandler = require('./webapp_handler');
// const messages = require('./protocol/messages');
const models = require('./sql/models');

const server = new net.Server();
const agents = [];

models.sequelize.sync({force: false}).then(() => {
  console.log('sequelize ready');

  server.on('connection', client => {
    console.log('New connection: ' + client);

    new Protocol(client, async function (message) {
      const content = message.content;
      switch (message.type) {
        case 0:  // auth webapp
          WebappHandler.authenticateUser(this, content.username, content.password);
          break;

        case 1:  // sign up
          WebappHandler.signUp(this, content.name, content.username, content.password);
          break;

        case 2:  // get data
          WebappHandler.queryLastData(this, content.userId, agents);
          break;

        case 3:  // setup alerts via DM
          WebappHandler.setupDiscordDm(this, content.userId, content.userTag);
          break;

        case 100:  // auth agent
          AgentHandler.authenticateUser(this, content.username, content.password, agents, client);
          break;

        default:
          console.log('unknown message type');
          break;
      }
    }).init();
  });

  server.listen(9000, 'localhost');
});