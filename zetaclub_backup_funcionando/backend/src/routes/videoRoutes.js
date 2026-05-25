const express = require("express");

const router = express.Router();

const videoController = require("../controllers/VideoController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { validateVideo } = require("../middlewares/validation");

// Admin routes primeiro, antes de /:id
router.get("/admin/stats", authMiddleware, videoController.getAdminStats);

// Public routes
router.get("/", videoController.getAllVideos);
router.get("/:id/related", videoController.getRelatedVideos);
router.post("/:id/view", videoController.registerView);
router.get("/:id", videoController.getVideoById);

// Protected video routes
router.post(
  "/",
  authMiddleware,
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
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateVideo,
  videoController.updateVideo,
);

router.delete("/:id", authMiddleware, videoController.deleteVideo);

module.exports = router;
