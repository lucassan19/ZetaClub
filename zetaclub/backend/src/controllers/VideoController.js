const { Video, Category, ViewLog, sequelize } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { processVideo } = require('../utils/VideoProcessor');

exports.registerView = async (req, res) => {
  try {
    const videoId = req.params.id;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'];
    
    // Hash IP for privacy
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    
    // Rule: same IP + same video only counts every 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    const recentView = await ViewLog.findOne({
      where: {
        videoId,
        ipHash,
        createdAt: { [Op.gt]: thirtyMinutesAgo }
      }
    });

    if (!recentView) {
      await ViewLog.create({
        videoId,
        ipHash,
        userAgent,
        referer
      });
      
      // Increment total views in Video model
      await Video.increment('views', { where: { id: videoId } });
      return res.json({ success: true, message: 'View registered' });
    }

    res.json({ success: false, message: 'View already counted recently' });
  } catch (error) {
    console.error('Error registering view:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    console.log('Fetching admin stats...');

    const [
      totalVideos,
      totalViews,
      viewsToday,
      viewsLast7Days,
      topVideos,
      viewsByCategory
    ] = await Promise.all([
      Video.count({ where: { status: 'published' } }).catch(e => { console.error('Error count videos:', e); return 0; }),
      Video.sum('views').catch(e => { console.error('Error sum views:', e); return 0; }),
      ViewLog.count({ where: { createdAt: { [Op.gte]: today } } }).catch(e => { console.error('Error count views today:', e); return 0; }),
      ViewLog.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }).catch(e => { console.error('Error count views 7d:', e); return 0; }),
      Video.findAll({
        order: [['views', 'DESC']],
        limit: 10,
        attributes: ['id', 'title', 'views']
      }).catch(e => { console.error('Error find top videos:', e); return []; }),
      Category.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('Videos.id')), 'videoCount'],
          [sequelize.fn('SUM', sequelize.col('Videos.views')), 'totalViews']
        ],
        include: [{
          model: Video,
          attributes: [],
          required: false
        }],
        group: ['Category.id'],
        order: [[sequelize.literal('totalViews'), 'DESC']]
      }).catch(e => { console.error('Error find views by category:', e); return []; })
    ]);

    // Daily views for the last 7 days for the chart
    const dailyViews = await ViewLog.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: [
        [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('date', sequelize.col('createdAt'))],
      order: [[sequelize.fn('date', sequelize.col('createdAt')), 'ASC']]
    }).catch(e => { console.error('Error find daily views:', e); return []; });

    res.json({
      totalVideos: totalVideos || 0,
      totalViews: totalViews || 0,
      viewsToday: viewsToday || 0,
      viewsLast7Days: viewsLast7Days || 0,
      topVideos: topVideos || [],
      viewsByCategory: viewsByCategory || [],
      dailyViews: dailyViews || []
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Erro ao carregar estatísticas' });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const { search, categoryId, limit = 12, offset = 0 } = req.query;
    let where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const { count, rows: videos } = await Video.findAndCountAll({
      where,
      include: [Category],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json({ videos, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [Category]
    });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    if (!videoFile) {
      return res.status(400).json({ message: 'Arquivo de vídeo é obrigatório' });
    }

    if (!categoryId) {
      return res.status(400).json({ message: 'Categoria é obrigatória' });
    }

    const video = await Video.create({
      title,
      description,
      categoryId: parseInt(categoryId),
      videoUrl: `/uploads/${videoFile.filename}`, // Original temporary path
      thumbnailUrl: thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null,
      status: 'processing'
    });

    // Move files to specific directory and start processing
    const videoDir = path.join(__dirname, '../../uploads/videos', video.id.toString());
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    const oldVideoPath = path.join(__dirname, '../../', video.videoUrl);
    const newVideoPath = path.join(videoDir, 'original' + path.extname(videoFile.originalname));
    fs.renameSync(oldVideoPath, newVideoPath);

    // Update database with final paths
    await video.update({
      videoUrl: `/uploads/videos/${video.id}/original${path.extname(videoFile.originalname)}`,
      hlsUrl: `/uploads/videos/${video.id}/master.m3u8`
    });

    // Run processing in background
    processVideo(newVideoPath, videoDir)
      .then(async () => {
        await video.update({ status: 'completed' });
      })
      .catch(async (err) => {
        console.error('Processing failed for video', video.id, err);
        await video.update({ status: 'failed' });
      });

    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ message: error.message || 'Erro ao criar vídeo' });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    const video = await Video.findByPk(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });

    const videoFile = req.files['video'] ? req.files['video'][0] : null;
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

    const updatedData = {
      title: title || video.title,
      description: description || video.description,
      categoryId: categoryId ? parseInt(categoryId) : video.categoryId
    };

    if (videoFile) {
      // Delete old file
      const oldPath = path.join(__dirname, '../../', video.videoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      updatedData.videoUrl = `/uploads/${videoFile.filename}`;
    }

    if (thumbnailFile) {
      // Delete old file
      if (video.thumbnailUrl) {
        const oldThumbPath = path.join(__dirname, '../../', video.thumbnailUrl);
        if (fs.existsSync(oldThumbPath)) fs.unlinkSync(oldThumbPath);
      }
      updatedData.thumbnailUrl = `/uploads/${thumbnailFile.filename}`;
    }

    await video.update(updatedData);
    res.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ message: error.message || 'Erro ao atualizar vídeo' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Delete directory with all versions (original + HLS)
    const videoDir = path.join(__dirname, '../../uploads/videos', video.id.toString());
    if (fs.existsSync(videoDir)) {
      fs.rmSync(videoDir, { recursive: true, force: true });
    }

    // Delete standalone original if it exists (fallback for old structure)
    const oldVideoPath = path.join(__dirname, '../../', video.videoUrl);
    if (fs.existsSync(oldVideoPath) && !oldVideoPath.includes(`videos${path.sep}${video.id}`)) {
      fs.unlinkSync(oldVideoPath);
    }

    if (video.thumbnailUrl) {
      const thumbPath = path.join(__dirname, '../../', video.thumbnailUrl);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    await video.destroy();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
