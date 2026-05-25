const { body, validationResult } = require("express-validator");

const validateVideo = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ max: 255 })
    .withMessage("O título deve ter no máximo 255 caracteres"),

  body("description").optional().trim(),

  body("categoryId")
    .notEmpty()
    .withMessage("Categoria é obrigatória")
    .isInt({ min: 1 })
    .withMessage("Categoria inválida"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("[VALIDATION_ERROR_VIDEO]:", errors.array());

      return res.status(400).json({
        success: false,
        message: "Erro de validação",
        errors: errors.array(),
      });
    }

    next();
  },
];

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome da categoria é obrigatório")
    .isLength({ max: 100 })
    .withMessage("O nome da categoria deve ter no máximo 100 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error("[VALIDATION_ERROR_CATEGORY]:", errors.array());

      return res.status(400).json({
        success: false,
        message: "Erro de validação",
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateVideo,
  validateCategory,
};
