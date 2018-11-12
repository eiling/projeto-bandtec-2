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
      let data = message.content;
      data.dateTime = new Date().toISOString();

      this.dataQueue.push(message.content);
      while (this.dataQueue.length > 1) {  // remove old data
        this.dataQueue.shift();
      }

      //handle alert
      //handle persistence (in a promise)

      // request again
      const resources = [];

      if (this.cpu !== -102){
        resources.push('cpu');
      }
      if (this.memory !== -102){
        resources.push('memory');
      }
      if (this.disk !== -102){
        resources.push('disk');
      }

      setTimeout(() => this.protocol.send({type: 0, content: {resources: resources},}), 1000 /* - elapsed */);
    }
  }).init();
}

AgentState.prototype.start = function() {
  const resources = [];

  if (this.cpu !== -102){
    resources.push('cpu');
  }
  if (this.memory !== -102){
    resources.push('memory');
  }
  if (this.disk !== -102){
    resources.push('disk');
  }

  // ALL messages to agent should be sent synchronously via the queue
  setImmediate(() => this.protocol.send({type: 0, content: {resources: resources},}));

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