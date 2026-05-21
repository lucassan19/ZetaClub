const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Video', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hlsUrl: {
      type: DataTypes.STRING
    },
    thumbnailUrl: {
      type: DataTypes.STRING
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('published', 'draft', 'processing', 'failed'),
      defaultValue: 'published'
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    qualities: {
      type: DataTypes.STRING, // Store as "480p,720p,1080p"
      defaultValue: ""
    }
  }, {
    indexes: [
      { fields: ['categoryId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  });
};
