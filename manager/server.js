'use strict';

const net = require('net');
const Protocol = require('./protocol/protocol');
const AgentState = require('./agent_state');
const messages = require('./protocol/message_type_constants');

const models = require('./sql/models');

const server = new net.Server();
const agents = [];

server.on('connection', client => {
  console.log('New connection: ' + client);

  new Protocol(client, function(message) {
    const content = message.content;
    switch (message.type) {
      case 0:  // test auth webapp
        const id1 = auth(content.username, content.password);
        if (id1 !== 'NULL') {
          this.send({
            type: 21,
            content: {
              id: id1,
            },
          });
        } else {
          this.send({
            type: 20,
            content: {},
          });
        }

        break;

      case 1:  // test auth agent
        const id2 = auth(content.username, content.password);
        if (id2 !== 'NULL') {
          let msg = {
            type: 11,
            content: {
              id: id2,
            }
          };
          this.send(msg);
          agents.push(new AgentState(id2, client).start());
        }

        break;

      case 2:  // test agent -- remove later
        console.log('GAH');

        break;

      case 4:  // setup alerts via DM
        // request should contain userId and discordTag
        models.User.findById(content.userId).then(user => {
          const botSocket = new net.Socket();
          botSocket.connect(12000, 'localhost', () => {
            new Protocol(botSocket, response => {
              if(response.type === 0){
                user.discordId = response.content.discordId;
                user.save().then(() => {
                  this.send({  // response to webapp
                    type: 0,
                    content: {
                      discordId: response.content.discordId,
                    },
                  });
                  console.log('SAVED');
                });
              } else {
                console.log('ERROR');
              }
            }).init().send({
              type: 0,
              content: {
                name: user.name,
                discordTag: content.discordTag,
              },
            });
          });
        });

        break;

      default:
        console.log('unknown message type');
        break;
    }
  }).init();
});

function auth(u, p) {
  if (u === 'user' && p === 'passwd') {
    return "userId";
  }
  return 'NULL';
}

server.listen(9000, 'localhost');
