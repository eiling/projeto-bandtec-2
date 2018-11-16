'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('alert', {
    type: {
      type: DataTypes.STRING,
    },
    threshold: {
      type: DataTypes.BIGINT,
      get(){
        return parseInt(this.getDataValue('threshold'));
      },
    },
    beginTime: {
      type: DataTypes.DATE,
    },
    endTime: {
      type: DataTypes.DATE,
    },
  });
};
