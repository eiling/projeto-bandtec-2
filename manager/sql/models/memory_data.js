'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('memoryData', {
    available: {
      type: DataTypes.BIGINT,
    },
    total: {
      type: DataTypes.BIGINT,
    },
    datetime: {
      type: DataTypes.DATE,
    },
  });
};
