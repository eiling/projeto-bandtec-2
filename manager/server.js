'use strict';

const net = require('net');

const Protocol = require('./protocol/protocol');
const AgentHandler = require('./agent_handler');
const WebappHandler = require('./webapp_handler');
// const messages = require('./protocol/messages');
const models = require('./sql/models');

const agentListener = new net.Server();
const webappListener = new net.Server();
const botListener = new net.Server();

const agents = [];

models.sequelize.sync({force: false}).then(() => {
  console.log('sequelize ready');

  agentListener.on('connection', agent => {
    console.log('New Agent connection');

    agent.on('error', () => {
      const index = agents.find(e => e.socket === agent);
      if(index !== -1){
        agents.splice(index, 1);
      }
    });

    new Protocol(agent, async function (message) {
      const content = message.content;
      switch (message.type){
        case 0:  // auth
          AgentHandler.authenticateUser(this, content.username, content.password, content.agentId, agents, agent);
          break;

        default:
          console.log('unknown message type');
          break;
      }
    }).init();
  });

  agentListener.listen(9000, 'localhost');

  webappListener.on('connection', socket => {
    console.log('New WebApp connection');

    new Protocol(socket, async function (message) {
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

        default:
          console.log('unknown message type');
          break;
      }
    }).init();
  });

  webappListener.listen(9001, 'localhost');

  botListener.on('connnection', socket => {
    console.log('New Bot connection');

    new Protocol(socket, async function (message) {
      const content = message.content;
      switch (message.type) {
        default:
          console.log('unknown message type');
          break;
      }
    }).init();
  });

  botListener.listen(9002, 'localhost');
});

module.exports = agents;  // for testing purposes