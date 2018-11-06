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
    disc: {
      type: DataTypes.BIGINT,
    },
  });
};
