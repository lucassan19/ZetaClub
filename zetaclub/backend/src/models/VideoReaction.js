const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "VideoReaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("like", "dislike"),
        allowNull: false,
      },
    },
    {
      tableName: "VideoReactions",
      indexes: [
        {
          unique: true,
          fields: ["videoId", "deviceId"],
        },
      ],
    },
  );
};
