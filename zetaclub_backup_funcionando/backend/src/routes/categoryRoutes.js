const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middlewares/auth');
const { validateCategory } = require('../middlewares/validation');

router.get('/', categoryController.getAllCategories);

// Protected routes
router.post('/', authMiddleware, validateCategory, categoryController.createCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
