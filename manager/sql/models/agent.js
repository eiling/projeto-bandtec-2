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
    },
    memory: {
      type: DataTypes.BIGINT,
    },
    disk: {  // change to disk
      type: DataTypes.BIGINT,
    },
  });
};
