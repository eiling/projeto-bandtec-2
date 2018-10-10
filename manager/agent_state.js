'use strict';

const Protocol = require('./protocol/protocol');

function AgentState(id, socket) {
  socket._events.data = undefined;
  socket._events.served = undefined;

  this.id = id;
  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, message => {
    this.dataQueue.push(message.content);
    console.log(message.content.cpu);
    //handle alert
    //handle persistence (in a promise)

    this.protocol.send({type: 10,}); // request again
  }).init();
}

AgentState.prototype.start = function() {
  this.protocol.send({type: 10,});

  return this;
};

module.exports = AgentState;