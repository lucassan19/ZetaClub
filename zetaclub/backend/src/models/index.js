const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: (msg) => console.log(`[SEQUELIZE] ${msg}`)
});

const Category = require('./Category')(sequelize);
const Video = require('./Video')(sequelize);
const ViewLog = require('./ViewLog')(sequelize);
const Favorite = require('./Favorite')(sequelize);
const Progress = require('./Progress')(sequelize);
const VideoReaction = require('./VideoReaction')(sequelize);

// Relationships
Category.hasMany(Video, { foreignKey: 'categoryId' });
Video.belongsTo(Category, { foreignKey: 'categoryId' });

Video.hasMany(ViewLog, { foreignKey: 'videoId', onDelete: 'CASCADE' });
ViewLog.belongsTo(Video, { foreignKey: 'videoId' });

Video.hasMany(Favorite, { foreignKey: 'videoId', onDelete: 'CASCADE' });
Favorite.belongsTo(Video, { foreignKey: 'videoId' });

Video.hasMany(Progress, { foreignKey: 'videoId', onDelete: 'CASCADE' });
Progress.belongsTo(Video, { foreignKey: 'videoId' });

Video.hasMany(VideoReaction, { foreignKey: 'videoId', onDelete: 'CASCADE' });
VideoReaction.belongsTo(Video, { foreignKey: 'videoId' });

module.exports = {
  sequelize,
  Video,
  Category,
  ViewLog,
  Favorite,
  Progress,
  VideoReaction
};
