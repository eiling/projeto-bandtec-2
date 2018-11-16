'use strict';

const sequelize = require('../secrets/connection');

const User = sequelize.import(__dirname + '\\models\\user.js');
const Agent = sequelize.import(__dirname + '\\models\\agent.js');
const Alert = sequelize.import(__dirname + '\\models\\alert.js');
const ProcessorData = sequelize.import(__dirname + '\\models\\processor_data.js');
const MemoryData = sequelize.import(__dirname + '\\models\\memory_data.js');
const FileStoreData = sequelize.import(__dirname + '\\models\\file_store_data.js');

User.hasMany(Agent, {foreignKey: 'userId', onDelete: 'CASCADE',});
Agent.hasMany(Alert, {foreignKey: 'agentId', onDelete: 'CASCADE',});
Agent.hasMany(ProcessorData, {foreignKey: 'agentId', onDelete: 'CASCADE',});
Agent.hasMany(MemoryData, {foreignKey: 'agentId', onDelete: 'CASCADE',});
Agent.hasMany(FileStoreData, {foreignKey: 'agentId', onDelete: 'CASCADE',});

module.exports = {
  sequelize,
  User,
  Agent,
  Alert,
  ProcessorData,
  MemoryData,
  FileStoreData,
};