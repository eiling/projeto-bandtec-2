module.exports = (sequelize, DataTypes) => {
  return sequelize.define('history', {
    gpu: {
      type: DataTypes.STRING,
    },
    total_memory: {
      type: DataTypes.STRING,
    },
    used_memory: {
      type: DataTypes.STRING,
    },
    total_disc: {
      type: DataTypes.STRING,
    },
    used_disc: {
      type: DataTypes.STRING,
    },
  });
}
