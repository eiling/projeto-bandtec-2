module.exports = (sequelize, DataTypes) => {
  return sequelize.define('computer', {
    name: {
      type: DataTypes.INTEGER,
    },
    network: {
      type: DataTypes.INTEGER,
    },
    disc: {
      type: DataTypes.INTEGER,
    },
    memory: {
      type: DataTypes.INTEGER,
    },
    cpu: {
      type: DataTypes.INTEGER,
    },
    gpu: {
      type: DataTypes.INTEGER,
    },
    monitoring: {
      type: DataTypes.INTEGER,
    },
  });
};
