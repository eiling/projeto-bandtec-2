'use strict';

const net = require('net');

const Discord = require('discord.js');

const Protocol = require('./protocol/protocol');
const RequestHandler = require('./request_handler');

const token = require('./secrets/token');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  let server = new net.Server();
  server.on('connection', socket => {
    new Protocol(socket, function(message) {
      const content = message.content;
      switch (message.type) {
        case 0:  // setup alert via dm
          RequestHandler.setupDiscordDm(this, client, content.tag);
          break;

        default:
          console.log('unknown message type');

          break;
      }

      socket.end();
    }).init();
  });

  server.listen(12000, 'localhost');
});

client.on('message', msg => {
  //handle commands
});

client.login(token).catch(console.log);
