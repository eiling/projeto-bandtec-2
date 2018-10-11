'use strict';

// Eagle Guild ID === 487343475445202944

const net = require('net');
const Discord = require('discord.js');
const Protocol = require('./protocol');
const messages = require('./messages');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  console.log(client.guilds.get('487343475445202944').name);

  let server = new net.Server();
  server.on('connection', socket => {
    new Protocol(socket, function(message) {
      const content = message.content;
      switch (message.type) {
        case 0:  // setup alert via dm
          let id = client.guilds.get('487343475445202944').members.find(m => m.user.tag === content.discordTag).user.id;
          this.send({
            type: 0,
            content: {
              discordId: id,
            },
          });
          console.log('id sent');

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

client.login('NDg3MzE5NjM4ODIxMzA2MzY4.DnL7fA.GPd3LkdSO-NziLzKZ6fmVfQs4Yc').catch(console.log);
