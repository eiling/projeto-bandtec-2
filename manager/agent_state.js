'use strict';

const Protocol = require('./protocol/protocol');
const Util = require('./util');
const models = require('./sql/models');

const SAMPLE_SIZE = 10;

function AgentState(userId, agentId, agentName, agentInterval, agentCpu, agentMemory, agentDisk, discordId, socket) {
  socket._events.data = undefined;
  socket._events.served = undefined;

  this.userId = userId;
  this.agentId = agentId;
  this.name = agentName;
  this.interval = agentInterval;
  this.cpu = agentCpu;
  this.memory = agentMemory;
  this.disk = agentDisk;

  this.discordId = discordId;

  this.cpuAlertState_ = {};
  this.memoryAlertState_ = {};
  this.diskAlertState_ = {};

  this.socket = socket;
  this.dataQueue = [];
  this.protocol = new Protocol(this.socket, async message => {
    const now = Date.now();

    if (message.type === 0) {
      // store date/time from data
      const data = message.content;
      data.timestamp = now;

      this.dataQueue.push(data);

      const dateIsoString = new Date(now).toISOString();

      if (this.dataQueue.length > SAMPLE_SIZE) {  // store old data | what to do when connection is slow?
        const tempData = this.dataQueue.slice(0, SAMPLE_SIZE);
        this.dataQueue.splice(0, SAMPLE_SIZE);

        // test sample
        let processorPassed = true;
        let memoryPassed = true;
        let fileStoresPassed = true;

        tempData.forEach(e => {
          if(e.processor === undefined){
            processorPassed = false;
          }
          if(e.memory === undefined){
            memoryPassed = false;
          }
          if(e.fileStores === undefined){
            fileStoresPassed = false;
          }
        });

        // define objects
        const resources = {};
        if(processorPassed){
          resources.processor = {
            systemCpuLoad: 0,
            datetime: dateIsoString,
            agentId: this.agentId,
          };
        }
        if(memoryPassed){
          resources.memory = {
            available: 0,
            total: tempData[0].memory.total,
            datetime: dateIsoString,
            agentId: this.agentId,
          };
        }
        if(fileStoresPassed){
          resources.fileStores = [];
          tempData[0].fileStores.forEach(e => {
            resources.fileStores.push({
              mount: e.mount,
              usableSpace: 0,
              totalSpace: e.totalSpace,
              datetime: dateIsoString,
              agentId: this.agentId,
            });
          });
        }

        // calculate averages
        tempData.forEach(e => {
          if (processorPassed) {
            resources.processor.systemCpuLoad += e.processor.systemCpuLoad;
          }
          if (memoryPassed) {
            resources.memory.available += e.memory.available;
          }
          if (fileStoresPassed) {
            const l = resources.fileStores.length;
            for (let i = 0; i < l; i++){
              resources.fileStores[i].usableSpace += e.fileStores[i].usableSpace;
            }
          }
        });

        if(processorPassed){
          resources.processor.systemCpuLoad /= SAMPLE_SIZE;
        }
        if(memoryPassed){
          resources.memory.available /= SAMPLE_SIZE;
        }
        if(fileStoresPassed){
          resources.fileStores.forEach(e => e.usableSpace /= SAMPLE_SIZE);
        }

        // store objects  -- handle errors properly
        if (processorPassed) {
          models.ProcessorData.build(resources.processor).save()
              .then(() => {console.log('saved processorData')})
              .catch(() => {console.error('error saving processorData')});
        }
        if (memoryPassed) {
          models.MemoryData.build(resources.memory).save()
              .then(() => {console.log('saved memoryData')})
              .catch(() => {console.error('error saving memoryData')});
        }
        if (fileStoresPassed) {
          resources.fileStores.forEach(e => models.FileStoreData.build(e).save()
              .then(() => {console.log('saved fileStoreData')})
              .catch(() => {console.error('error saving fileStoreData')}));
        }
      }

      //handle alerts  --  THIS COULD BE BETTER
      if (this.cpu <= 0 && this.cpu >= -100) {
        if (data.processor.systemCpuLoad * 100 > -this.cpu) {
          if (!this.cpuAlertState_.alert) {
            Util.sendAlertToBot(this.userId, {
              name: this.name,
              resource: 'CPU',
              threshold: this.cpu,
              timestamp: now,
            }, response => {
              console.log(response);  // handle error when sending message
            });

            this.cpuAlertState_.alert = true;
            this.cpuAlertState_.threshold = this.cpu;
            this.cpuAlertState_.time = new Date(now).toISOString();
          }
        } else {
          if (this.cpuAlertState_.alert) {
            Util.saveAlert('CPU', this.cpuAlertState_.threshold,
                this.cpuAlertState_.time, new Date(now).toISOString(),
                this.agentId);

            this.cpuAlertState_ = {};
          }
        }
      } else if (this.cpuAlertState_.alert) {
        Util.saveAlert('CPU', this.cpuAlertState_.threshold,
            this.cpuAlertState_.time, new Date(now).toISOString(),
            this.agentId);

        this.cpuAlertState_ = {};
      }
      if (this.memory <= 0 && this.memory >= -100) {
        if (100 - data.memory.available * 100 / data.memory.total > -this.memory) {
          if (!this.memoryAlertState_.alert) {
            Util.sendAlertToBot(this.userId, {
              name: this.name,
              resource: 'memória',
              threshold: this.memory,
              timestamp: now,
            }, response => {
              console.log(response);  // handle error when sending message
            });

            this.memoryAlertState_.alert = true;
            this.memoryAlertState_.threshold = this.memory;
            this.memoryAlertState_.time = new Date(now).toISOString();
          }
        } else {
          if (this.memoryAlertState_.alert) {
            Util.saveAlert('MEMORY', this.memoryAlertState_.threshold,
                this.memoryAlertState_.time, new Date(now).toISOString(),
                this.agentId);

            this.memoryAlertState_ = {};
          }
        }
      } else if (this.memory > 0) {
        if (data.memory.available < this.memory) {
          if (!this.memoryAlertState_.alert) {
            Util.sendAlertToBot(this.userId, {
              name: this.name,
              resource: 'memória',
              threshold: this.memory,
              timestamp: now,
            }, response => {
              console.log(response);  // handle error when sending message
            });

            this.memoryAlertState_.alert = true;
            this.memoryAlertState_.threshold = this.memory;
            this.memoryAlertState_.time = new Date(now).toISOString();
          }
        } else {
          if (this.memoryAlertState_.alert) {
            Util.saveAlert('MEMORY', this.memoryAlertState_.threshold,
                this.memoryAlertState_.time, new Date(now).toISOString(),
                this.agentId);

            this.memoryAlertState_ = {};
          }
        }
      } else if (this.memoryAlertState_.alert) {
        Util.saveAlert('MEMORY', this.memoryAlertState_.threshold,
            this.memoryAlertState_.time, new Date(now).toISOString(),
            this.agentId);

        this.memoryAlertState_ = {};
      }
      for (let i of data.fileStores) {
        if (i.mount !== 'C:\\' && i.mount !== '/') continue;

        if (this.disk <= 0 && this.disk >= -100) {
          if (100 - i.usableSpace * 100 / i.totalSpace > -this.disk) {
            if (!this.diskAlertState_.alert) {
              Util.sendAlertToBot(this.userId, {
                name: this.name,
                resource: 'partição de disco primária',
                threshold: this.disk,
                timestamp: now,
              }, response => {
                console.log(response);  // handle error when sending message
              });

              this.diskAlertState_.alert = true;
              this.diskAlertState_.threshold = this.disk;
              this.diskAlertState_.time = new Date(now).toISOString();
            }
          } else {
            if (this.diskAlertState_.alert) {
              Util.saveAlert('DISK', this.diskAlertState_.threshold,
                  this.diskAlertState_.time, new Date(now).toISOString(),
                  this.agentId);

              this.diskAlertState_ = {};
            }
          }
        } else if (this.disk > 0) {
          if (i.usableSpace < this.disk) {
            if (!this.diskAlertState_.alert) {
              Util.sendAlertToBot(this.userId, {
                name: this.name,
                resource: 'partição de disco primária',
                threshold: this.disk,
                timestamp: now,
              }, response => {
                console.log(response);  // handle error when sending message
              });

              this.diskAlertState_.alert = true;
              this.diskAlertState_.threshold = this.disk;
              this.diskAlertState_.time = new Date(now).toISOString();
            }
          } else {
            if (this.diskAlertState_.alert) {
              Util.saveAlert('DISK', this.diskAlertState_.threshold,
                  this.diskAlertState_.time, new Date(now).toISOString(),
                  this.agentId);

              this.diskAlertState_ = {};
            }
          }
        } else if (this.diskAlertState_.alert) {
          Util.saveAlert('DISK', this.diskAlertState_.threshold,
              this.diskAlertState_.time, new Date(now).toISOString(),
              this.agentId);

          this.diskAlertState_ = {};
        }
      }

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
          this.interval - Date.now() + now  // check if this is less than zero -> server is lagging
      );
    }
  }).init();
}

AgentState.prototype.start = function () {
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

AgentState.prototype.get = function () {  // can we have a race condition here?
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

AgentState.prototype.stop = function () {
  setImmediate(() => this.protocol.send({type: 1, content: {},}));
};

module.exports = AgentState;