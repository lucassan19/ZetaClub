const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false
});

const Category = require('./Category')(sequelize);
const Video = require('./Video')(sequelize);
const ViewLog = require('./ViewLog')(sequelize);

// Relationships
Category.hasMany(Video, { foreignKey: 'categoryId' });
Video.belongsTo(Category, { foreignKey: 'categoryId' });

Video.hasMany(ViewLog, { foreignKey: 'videoId', onDelete: 'CASCADE' });
ViewLog.belongsTo(Video, { foreignKey: 'videoId' });

module.exports = {
  sequelize,
  Video,
  Category,
  ViewLog
};
