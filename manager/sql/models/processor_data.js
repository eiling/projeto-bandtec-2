'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('processorData', {
    systemCpuLoad: {
      type: DataTypes.DOUBLE,
    },
    datetime: {
      type: DataTypes.DATE,
    },
  });
};
