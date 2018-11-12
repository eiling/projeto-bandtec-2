'use strict';

const Protocol = require('./protocol/protocol');

function AgentState(userId, agentId, agentName, agentInterval, agentCpu, agentMemory, agentDisk, socket) {
  socket._events.data = undefined;
  socket._events.served = undefined;

  this.userId = userId;
  this.agentId = agentId;
  this.name = agentName;
  this.interval = agentInterval;
  this.cpu = agentCpu;
  this.memory = agentMemory;
  this.disk = agentDisk;

  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, async message => {
    if (message.type === 0) {
      // store date/time from data
      this.dataQueue.push(message.content);
      while (this.dataQueue.length > 5) {  // remove old data
        this.dataQueue.shift();
      }

      //handle alert
      //handle persistence (in a promise)

      // request again
      setTimeout(() => this.protocol.send({type: 0, content: {},}), 1000 /* - elapsed */);
      // remove timeout later? to make it real time... maaaaaaaaybe not
    }
  }).init();
}

AgentState.prototype.start = function() {
  // ALL messages to agent should be sent synchronously via the queue
  setImmediate(() => this.protocol.send({type: 0, content: {},}));

  return this;
};

AgentState.prototype.getLast = function() {
  const len = this.dataQueue.length;
  if (len === 0) {
    return {};
  }
  return this.dataQueue[len - 1];
};

AgentState.prototype.stop = function() {
  setImmediate(() => this.protocol.send({type: 1, content: {},}));
};

module.exports = AgentState;