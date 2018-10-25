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
    console.log(message.content);
    //handle alert
    //handle persistence (in a promise)

    setTimeout(() => this.protocol.send({type: 10, content: {},}), 1000); // request again
  }).init();
}

AgentState.prototype.start = function() {
  this.protocol.send({type: 10, content: {},});

  return this;
};

AgentState.prototype.getLast = function() {
  const len = this.dataQueue.length;
  if (len == 0) {
    return {};
  }
  return this.dataQueue[len - 1];
};

module.exports = AgentState;