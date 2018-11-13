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

  this.cpuAlertState_ = {};
  this.memoryAlertState_ = {};
  this.diskAlertState_ = {};

  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, async message => {
    const start = Date.now();

    if (message.type === 0) {
      // store date/time from data
      let data = message.content;
      data.dateTime = new Date().toISOString();

      this.dataQueue.push(message.content);
      while (this.dataQueue.length > 1) {  // remove old data
        this.dataQueue.shift();
      }

      //handle alerts
      if (this.cpu <= 0 && this.cpu >= -100) {
        if (data.processor.systemCpuLoad * 100 > -this.cpu) {
          if (!this.cpuAlertState_.alert) {
            // send message
            this.cpuAlertState_.alert = true;
            this.cpuAlertState_.beginTime = data.dateTime;
          }
        } else {
          if (this.cpuAlertState_.alert) {
            this.cpuAlertState_.endTime = data.dateTime;
            // save to database

            this.cpuAlertState_ = {};
          }
        }
      } else if (this.cpuAlertState_.alert) {
        this.cpuAlertState_.endTime = data.dateTime;
        // save to database

        this.cpuAlertState_ = {};
      }
      if (this.memory <= 0 && this.memory >= -100) {
        if (100 - data.memory.available * 100 / data.memory.total > -this.memory) {
          if (!this.memoryAlertState_.alert) {
            // send message
            this.memoryAlertState_.alert = true;
            this.memoryAlertState_.beginTime = data.dateTime;
          }
        } else {
          if (this.memoryAlertState_.alert) {
            this.memoryAlertState_.endTime = data.dateTime;
            // save to database

            this.memoryAlertState_ = {};
          }
        }
      } else if (this.memory > 0) {
        if (data.memory.available < this.memory) {
          if (!this.memoryAlertState_.alert) {
            // send message
            this.memoryAlertState_.alert = true;
            this.memoryAlertState_.beginTime = data.dateTime;
          }
        } else {
          if (this.memoryAlertState_.alert) {
            this.memoryAlertState_.endTime = data.dateTime;
            // save to database

            this.memoryAlertState_ = {};
          }
        }
      } else if (this.memoryAlertState_.alert) {
        this.memoryAlertState_.endTime = data.dateTime;
        // save to database

        this.memoryAlertState_ = {};
      }
      for (let i of data.fileStores) {
        if (i.mount !== 'C:\\' && i.mount !== '/') continue;

        if (this.disk <= 0 && this.disk >= -100) {
          if (100 - i.usableSpace * 100 / i.totalSpace > -this.disk) {
            if (!this.diskAlertState_.alert) {
              // send message
              this.diskAlertState_.alert = true;
              this.diskAlertState_.beginTime = data.dateTime;
            }
          } else {
            if (this.diskAlertState_.alert) {
              this.diskAlertState_.endTime = data.dateTime;
              // save to database

              this.diskAlertState_ = {};
            }
          }
        } else if (this.disk > 0) {
          if (i.usableSpace < this.disk) {
            if (!this.diskAlertState_.alert) {
              // send message
              this.diskAlertState_.alert = true;
              this.diskAlertState_.beginTime = data.dateTime;
            }
          } else {
            if (this.diskAlertState_.alert) {
              this.diskAlertState_.endTime = data.dateTime;
              // save to database

              this.diskAlertState_ = {};
            }
          }
        } else if (this.diskAlertState_.alert) {
          this.diskAlertState_.endTime = data.dateTime;
          // save to database

          this.diskAlertState_ = {};
        }
      }

      //handle persistence (in a promise)

      // request again
      const resources = [];

      if (this.cpu !== -102) {
        resources.push('cpu');
      }
      if (this.memory !== -102) {
        resources.push('memory');
      }
      if (this.disk !== -102) {
        resources.push('disk');
      }

      setTimeout(
        () => this.protocol.send({type: 0, content: {resources: resources,},}),
        this.interval - Date.now() + start
      );
    }
  }).init();
}

AgentState.prototype.start = function() {
  const resources = [];

  if (this.cpu !== -102) {
    resources.push('cpu');
  }
  if (this.memory !== -102) {
    resources.push('memory');
  }
  if (this.disk !== -102) {
    resources.push('disk');
  }

  // ALL messages to agent should be sent synchronously via the queue
  setImmediate(() => this.protocol.send({type: 0, content: {resources: resources},}));

  return this;
};

AgentState.prototype.get = function() {
  const len = this.dataQueue.length;
  if (len === 0) {
    return {};
  }

  const data = this.dataQueue[len - 1];

  return {
    data: data,
    alerts: {
      cpu: this.cpuAlertState_.alert,
      memory: this.memoryAlertState_.alert,
      disk: this.diskAlertState_.alert,
    },
  };
};

AgentState.prototype.stop = function() {
  setImmediate(() => this.protocol.send({type: 1, content: {},}));
};

module.exports = AgentState;