'use strict';

const Protocol = require('./protocol/protocol');

function AgentState(userId, agentId, agentName, socket) {
  socket._events.data = undefined;
  socket._events.served = undefined;

  this.userId = userId;
  this.agentId = agentId;
  this.name = agentName;

  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, async message => {
    switch (message.type) {
      case 0:
        // store date/time from data
        this.dataQueue.push(message.content);
        while (this.dataQueue.length > 5) {  // remove old data
          this.dataQueue.shift();
        }

        //handle alert
        //handle persistence (in a promise)

        // request again
        setTimeout(() => this.protocol.send({type: 0, content: {},}), 1000);
        // remove timeout later? to make it real time...

        break;

      default:
        console.log('Unknown message type');
        break;
    }
  }).init();
}

AgentState.prototype.start = function () {
  this.protocol.send({type: 0, content: {},});

  return this;
};

AgentState.prototype.getLast = function () {
  const len = this.dataQueue.length;
  if (len === 0) {
    return {};
  }
  return this.dataQueue[len - 1];
};

module.exports = AgentState;