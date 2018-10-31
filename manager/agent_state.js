'use strict';

const Protocol = require('./protocol/protocol');

function AgentState(id, socket) {
  socket._events.data = undefined;
  socket._events.served = undefined;

  this.id = id;
  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, message => {
    if (message.type === 0) {
      setTimeout(() => this.protocol.send({type: 0, content: {},}), 1000); // request again

      // store date/time from data
      this.dataQueue.push(message.content);
      if (this.dataQueue.length > 5) {  // remove old data
        this.dataQueue.shift();
      }

      //handle alert
      //handle persistence (in a promise)
    } else {
      //stop
    }
  }).init();
}

AgentState.prototype.start = function() {
  this.protocol.send({type: 0, content: {},});

  return this;
};

AgentState.prototype.getLast = function() {
  const len = this.dataQueue.length;
  if (len === 0) {
    return {};
  }
  return this.dataQueue[len - 1];
};

module.exports = AgentState;