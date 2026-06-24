const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Favorite', {
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
    }
  }, {
    indexes: [
      { fields: ['deviceId', 'videoId'], unique: true }
    ]
  });
};
