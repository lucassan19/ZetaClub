const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');
const { loginLimiter, securityMiddlewares } = require('../middlewares/security');

// router.post('/login', loginLimiter, authController.login);
router.post('/login', authController.login);
router.get('/verify', authMiddleware, authController.verify);

module.exports = router;
