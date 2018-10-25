'use strict';

const net = require('net');
const Protocol = require('./protocol/protocol');
const AgentState = require('./agent_state');
const messages = require('./protocol/messages');

// const models = require('./sql/models');

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
            type: 0,
            content: {
              id: id1,
            },
          });
        } else {
          this.send({
            type: 1,
            content: {},
          });
        }

        break;

      case 100:  // auth agent
        const id2 = auth(content.username, content.password);
        if (id2 !== 'NULL') {
          let msg = {
            type: 0,
            content: {
              id: id2,
            }
          };
          this.send(msg);
          agents.push(new AgentState(id2, client).start());
        } else {
          this.send({
            type: 1,
            content: {},
          });
        }

        break;

      case 4:  // setup alerts via DM
        // request should contain userId and discordTag
        models.User.findById(content.userId).then(user => {
          const botSocket = new net.Socket();
          botSocket.connect(12000, 'localhost', () => {
            new Protocol(botSocket, response => {
              if (response.type === 0) {
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

      case 201:
        const agent = agents.find(e => e.id === content.userId);
        if (agent !== undefined) {
          const data = agent.getLast();
          console.log(data);
          this.send({
            type: 0,
            content: data,
          });
        } else {
          this.send({
            type: 1,
            content: {},
          });
        }

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
