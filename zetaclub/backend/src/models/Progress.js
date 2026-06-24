const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Progress', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currentTime: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    indexes: [
      { fields: ['deviceId', 'videoId'], unique: true }
    ]
  });
};
