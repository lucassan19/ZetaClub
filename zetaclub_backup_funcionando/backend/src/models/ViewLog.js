const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ViewLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ipHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userAgent: {
      type: DataTypes.TEXT
    },
    referer: {
      type: DataTypes.TEXT
    }
  }, {
    indexes: [
      { fields: ['videoId', 'ipHash', 'createdAt'] },
      { fields: ['createdAt'] }
    ]
  });
};
