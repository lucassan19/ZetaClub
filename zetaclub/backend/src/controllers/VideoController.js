const { Video, Category, ViewLog, sequelize } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { generateThumbnail } = require("../utils/VideoProcessor");

// Caminho fixo da raiz do backend
const backendRoot = path.resolve(__dirname, "../../");
const uploadsRoot = path.join(backendRoot, "uploads");

function publicPath(...parts) {
  return `/uploads/${parts.join("/")}`.replace(/\\/g, "/");
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function removePath(targetPath) {
  try {
    if (targetPath && fs.existsSync(targetPath)) {
      await fs.promises.rm(targetPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error("[REMOVE_PATH_ERROR]:", error);
  }
}

exports.registerView = async (req, res) => {
  try {
    const videoId = req.params.id;
    const ip = req.ip || "";
    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers["referer"] || "";

    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const recentView = await ViewLog.findOne({
      where: {
        videoId,
        ipHash,
        createdAt: { [Op.gt]: thirtyMinutesAgo },
      },
    });

    if (!recentView) {
      await ViewLog.create({
        videoId,
        ipHash,
        userAgent,
        referer,
      });

      await Video.increment("views", { where: { id: videoId } });

      return res.json({
        success: true,
        message: "View registered",
      });
    }

    return res.json({
      success: false,
      message: "View already counted recently",
    });
  } catch (error) {
    console.error("[REGISTER_VIEW_ERROR]:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    console.log("Fetching admin stats...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [totalVideos, totalViews, viewsToday, viewsLast7Days, topVideos] =
      await Promise.all([
        Video.count().catch(() => 0),
        Video.sum("views").catch(() => 0),
        ViewLog.count({ where: { createdAt: { [Op.gte]: today } } }).catch(
          () => 0,
        ),
        ViewLog.count({
          where: { createdAt: { [Op.gte]: sevenDaysAgo } },
        }).catch(() => 0),
        Video.findAll({
          order: [["views", "DESC"]],
          limit: 10,
          attributes: ["id", "title", "views", "status"],
        }).catch(() => []),
      ]);

    const categories = await Category.findAll({
      include: [
        {
          model: Video,
          attributes: ["id", "views"],
          required: false,
        },
      ],
    }).catch(() => []);

    const viewsByCategory = categories
      .map((category) => {
        const videos = category.Videos || [];

        return {
          id: category.id,
          name: category.name,
          videoCount: videos.length,
          totalViews: videos.reduce(
            (sum, video) => sum + (video.views || 0),
            0,
          ),
        };
      })
      .sort((a, b) => b.totalViews - a.totalViews);

    const dailyViews = await ViewLog.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: [
        [sequelize.fn("date", sequelize.col("createdAt")), "date"],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: [sequelize.literal("date(createdAt)")],
      order: [[sequelize.literal("date(createdAt)"), "ASC"]],
    }).catch(() => []);

    return res.json({
      totalVideos: totalVideos || 0,
      totalViews: totalViews || 0,
      viewsToday: viewsToday || 0,
      viewsLast7Days: viewsLast7Days || 0,
      topVideos: topVideos || [],
      viewsByCategory,
      dailyViews: dailyViews || [],
    });
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]:", error);
    return res.status(500).json({ message: "Erro ao carregar estatísticas" });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const { search, categoryId, limit = 12, offset = 0 } = req.query;

    const where = { status: "ready" };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const { count, rows: videos } = await Video.findAndCountAll({
      where,
      include: [Category],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json({ videos, count });
  } catch (error) {
    console.error("[GET_ALL_VIDEOS_ERROR]:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [Category],
    });

    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado" });
    }

    return res.json(video);
  } catch (error) {
    console.error("[GET_VIDEO_BY_ID_ERROR]:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getRelatedVideos = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado" });
    }

    const related = await Video.findAll({
      where: {
        categoryId: video.categoryId,
        id: { [Op.ne]: id },
        status: "ready",
      },
      limit: 4,
      order: sequelize.random(),
    });

    return res.json(related);
  } catch (error) {
    console.error("[GET_RELATED_VIDEOS_ERROR]:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  let video = null;

  const videoFile = req.files?.video?.[0] || null;
  const thumbnailFile = req.files?.thumbnail?.[0] || null;

  try {
    const { title, description, categoryId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Título é obrigatório" });
    }

    if (!videoFile) {
      return res
        .status(400)
        .json({ message: "Arquivo de vídeo é obrigatório" });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Categoria é obrigatória" });
    }

    console.log("🔥 FUNÇÃO DE UPLOAD EXECUTADA - ARQUIVO:", __filename);
    console.log("🔥 REQ.FILES COMPLETE:", req.files);
    console.log("🔥 VIDEO TEMP PATH:", videoFile.path);

    // Cria primeiro com URLs vazias para evitar erro NOT NULL no SQLite
    video = await Video.create({
      title,
      description: description || "",
      categoryId: Number(categoryId),
      status: "processing",
      views: 0,
      videoUrl: "",
      thumbnailUrl: "",
      hlsUrl: null,
      qualities: JSON.stringify([]),
    });

    const videoDir = path.join(uploadsRoot, "videos", String(video.id));
    await ensureDir(videoDir);

    const videoExt = path.extname(videoFile.originalname) || ".mp4";
    const finalFileName = `original${videoExt}`;
    const finalVideoPath = path.join(videoDir, finalFileName);

    console.log("🔥 UPLOADS ROOT:", uploadsRoot);
    console.log("🔥 VIDEO DIR:", videoDir);
    console.log("🔥 VIDEO DIR EXISTS:", fs.existsSync(videoDir));
    console.log("🔥 TEMP EXISTS:", fs.existsSync(videoFile.path));
    console.log("🔥 ORIGINAL PATH:", finalVideoPath);

    if (!fs.existsSync(videoFile.path)) {
      throw new Error(`Arquivo temporário não encontrado: ${videoFile.path}`);
    }

    await fs.promises.rename(videoFile.path, finalVideoPath);

    let thumbnailUrl = "";

    if (thumbnailFile) {
      const thumbExt = path.extname(thumbnailFile.originalname) || ".jpg";
      const thumbName = `thumb${thumbExt}`;
      const thumbPath = path.join(videoDir, thumbName);

      if (fs.existsSync(thumbnailFile.path)) {
        await fs.promises.rename(thumbnailFile.path, thumbPath);
        thumbnailUrl = publicPath("videos", video.id, thumbName);
      }
    } else {
      try {
        thumbnailUrl = await generateThumbnail(
          finalVideoPath,
          videoDir,
          video.id,
        );
      } catch (error) {
        console.error("[THUMBNAIL_GENERATE_ERROR]:", error);
        thumbnailUrl = "";
      }
    }

    const videoUrl = publicPath("videos", video.id, finalFileName);

    await video.update({
      videoUrl,
      thumbnailUrl,
      hlsUrl: null,
      status: "ready",
      qualities: JSON.stringify(["mp4"]),
    });

    console.log(`[UPLOAD_SUCCESS] Vídeo ${video.id} salvo com sucesso.`);
    console.log(`[UPLOAD_SUCCESS] URL pública: ${videoUrl}`);

    return res.status(201).json(video);
  } catch (error) {
    console.error("[UPLOAD_ERROR]:", error);

    if (video) {
      const videoDir = path.join(uploadsRoot, "videos", String(video.id));
      await removePath(videoDir);
      await video.destroy().catch(() => {});
    }

    if (videoFile?.path) {
      await removePath(videoFile.path);
    }

    if (thumbnailFile?.path) {
      await removePath(thumbnailFile.path);
    }

    return res.status(500).json({
      message: error.message || "Erro ao processar upload do vídeo",
    });
  }
};

exports.updateVideo = async (req, res) => {
  const videoFile = req.files?.video?.[0] || null;
  const thumbnailFile = req.files?.thumbnail?.[0] || null;

  try {
    const { title, description, categoryId } = req.body;

    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Vídeo não encontrado" });
    }

    const videoDir = path.join(uploadsRoot, "videos", String(video.id));
    await ensureDir(videoDir);

    const updatedData = {
      title: title || video.title,
      description: description || video.description,
      categoryId: categoryId ? Number(categoryId) : video.categoryId,
    };

    if (videoFile) {
      const existingFiles = fs.existsSync(videoDir)
        ? fs.readdirSync(videoDir)
        : [];

      for (const file of existingFiles) {
        if (!file.startsWith("thumb")) {
          await removePath(path.join(videoDir, file));
        }
      }

      const videoExt = path.extname(videoFile.originalname) || ".mp4";
      const finalFileName = `original${videoExt}`;
      const finalVideoPath = path.join(videoDir, finalFileName);

      if (!fs.existsSync(videoFile.path)) {
        throw new Error(`Arquivo temporário não encontrado: ${videoFile.path}`);
      }

      await fs.promises.rename(videoFile.path, finalVideoPath);

      updatedData.videoUrl = publicPath("videos", video.id, finalFileName);
      updatedData.hlsUrl = null;
      updatedData.status = "ready";
      updatedData.qualities = JSON.stringify(["mp4"]);
    }

    if (thumbnailFile) {
      const existingFiles = fs.existsSync(videoDir)
        ? fs.readdirSync(videoDir)
        : [];

      for (const file of existingFiles) {
        if (file.startsWith("thumb")) {
          await removePath(path.join(videoDir, file));
        }
      }

      const thumbExt = path.extname(thumbnailFile.originalname) || ".jpg";
      const thumbName = `thumb${thumbExt}`;
      const thumbPath = path.join(videoDir, thumbName);

      if (!fs.existsSync(thumbnailFile.path)) {
        throw new Error(
          `Thumbnail temporária não encontrada: ${thumbnailFile.path}`,
        );
      }

      await fs.promises.rename(thumbnailFile.path, thumbPath);
      updatedData.thumbnailUrl = publicPath("videos", video.id, thumbName);
    }

    await video.update(updatedData);

    return res.json(video);
  } catch (error) {
    console.error("[UPDATE_VIDEO_ERROR]:", error);

    if (videoFile?.path) {
      await removePath(videoFile.path);
    }

    if (thumbnailFile?.path) {
      await removePath(thumbnailFile.path);
    }

    return res.status(500).json({
      message: error.message || "Erro ao atualizar vídeo",
    });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Vídeo não encontrado",
      });
    }

    await video.increment("likes");

    await video.reload();

    return res.json({
      success: true,
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("[LIKE_VIDEO_ERROR]:", error);

    return res.status(500).json({
      message: "Erro ao curtir vídeo",
    });
  }
};

exports.dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Vídeo não encontrado",
      });
    }

    await video.increment("dislikes");

    await video.reload();

    return res.json({
      success: true,
      likes: video.likes,
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("[DISLIKE_VIDEO_ERROR]:", error);

    return res.status(500).json({
      message: "Erro ao descurtir vídeo",
    });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({
        message: "Vídeo não encontrado",
      });
    }

    const videoDir = path.join(uploadsRoot, "videos", String(id));

    await removePath(videoDir);

    await video.destroy();

    console.log(`[DELETE_SUCCESS] Vídeo ${id} removido completamente.`);

    return res.json({
      message: "Vídeo e arquivos relacionados foram excluídos com sucesso.",
    });
  } catch (error) {
    console.error("[DELETE_VIDEO_ERROR]:", error);

    return res.status(500).json({
      message: "Erro interno ao excluir o vídeo.",
    });
  }
};