const { body, validationResult } = require('express-validator');

const validateVideo = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório').isLength({ max: 255 }).escape(),
  body('description').trim().escape(),
  body('categoryId').notEmpty().withMessage('Categoria é obrigatória').isInt().withMessage('Categoria inválida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCategory = [
  body('name').trim().notEmpty().withMessage('Nome da categoria é obrigatório').isLength({ max: 100 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateVideo,
  validateCategory
};
