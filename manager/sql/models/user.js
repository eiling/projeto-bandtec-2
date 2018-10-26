'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    discordId: {
      type: DataTypes.STRING,
    },
  });
};
