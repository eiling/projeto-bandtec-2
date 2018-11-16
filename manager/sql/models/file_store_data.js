'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('fileStoreData', {
    mount: {
      type: DataTypes.STRING,
    },
    usableSpace: {
      type: DataTypes.BIGINT,
    },
    totalSpace: {
      type: DataTypes.BIGINT,
    },
    datetime: {
      type: DataTypes.DATE,
    },
  });
};
