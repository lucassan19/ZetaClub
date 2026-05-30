const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Video",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
      },

      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      hlsUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },

      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },

      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("ready", "draft", "processing", "failed"),
        allowNull: false,
        defaultValue: "processing",
      },

      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // 👍 Likes
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // 👎 Dislikes
      dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      qualities: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]",

        get() {
          const value = this.getDataValue("qualities");

          try {
            return JSON.parse(value || "[]");
          } catch {
            return [];
          }
        },

        set(value) {
          if (Array.isArray(value)) {
            this.setDataValue("qualities", JSON.stringify(value));
          } else {
            this.setDataValue("qualities", value || "[]");
          }
        },
      },
    },
    {
      tableName: "Videos",

      indexes: [
        { fields: ["categoryId"] },
        { fields: ["status"] },
        { fields: ["createdAt"] },
        { fields: ["views"] },
        { fields: ["likes"] },
      ],
    },
  );
};
