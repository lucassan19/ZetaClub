const express = require("express");

const router = express.Router();

const videoController = require("../controllers/VideoController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { validateVideo } = require("../middlewares/validation");
const { engagementLimiter, uploadLimiter } = require("../middlewares/security");

// Admin routes primeiro, antes de /:id
router.get("/admin/stats", authMiddleware, videoController.getAdminStats);

// Public routes
router.get("/", videoController.getAllVideos);
router.get("/favorites", videoController.getFavorites);
router.get("/continue-watching", videoController.getContinueWatching);
router.get("/:id/related", videoController.getRelatedVideos);
router.post("/:id/view", engagementLimiter, videoController.registerView);

router.get("/:id/reaction", videoController.getVideoReaction);
router.post("/:id/like", engagementLimiter, videoController.likeVideo);
router.post("/:id/dislike", engagementLimiter, videoController.dislikeVideo);

router.post("/:id/favorite", engagementLimiter, videoController.toggleFavorite);
router.get("/:id/favorite", videoController.checkFavorite);

router.post("/:id/progress", videoController.saveProgress);
router.get("/:id/progress", videoController.getProgress);

router.get("/:id", videoController.getVideoById);

// Protected video routes
router.post(
  "/",
  authMiddleware,
  uploadLimiter,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateVideo,
  videoController.createVideo,
);

router.put(
  "/:id",
  authMiddleware,
  uploadLimiter,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateVideo,
  videoController.updateVideo,
);

router.delete("/:id", authMiddleware, videoController.deleteVideo);

module.exports = router;
