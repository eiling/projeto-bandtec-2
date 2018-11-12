'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('agent', {
    name: {
      type: DataTypes.STRING,
    },
    interval: {
      type: DataTypes.INTEGER,
    },
    cpu: {
      type: DataTypes.BIGINT,
      get(){
        return parseInt(this.getDataValue('cpu'));
      },
    },
    memory: {
      type: DataTypes.BIGINT,
      get(){
        return parseInt(this.getDataValue('memory'));
      },
    },
    disk: {
      type: DataTypes.BIGINT,
      get(){
        return parseInt(this.getDataValue('disk'));
      },
    },
  });
};
