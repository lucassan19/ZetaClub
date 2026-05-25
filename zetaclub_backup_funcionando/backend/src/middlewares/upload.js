const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Raiz fixa do backend: backend/
const backendRoot = path.resolve(__dirname, "../../");

// Pasta temporária dos uploads: backend/uploads/temp
const tempUploadDir = path.join(backendRoot, "uploads", "temp");

function ensureTempUploadDir() {
  if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      ensureTempUploadDir();

      console.log("🔥 MULTER DESTINO USADO:", tempUploadDir);
      console.log("🔥 MULTER FIELD:", file.fieldname);
      console.log("🔥 MULTER FILE:", file.originalname);

      cb(null, tempUploadDir);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    try {
      const originalExtension = path.extname(file.originalname).toLowerCase();
      const safeRandomName = crypto.randomBytes(16).toString("hex");
      cb(null, `${safeRandomName}${originalExtension}`);
    } catch (error) {
      cb(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "video") {
    const allowedVideoExtensions = [".mp4", ".webm", ".mov"];
    const allowedVideoMimeTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ];

    const isValidExtension = allowedVideoExtensions.includes(extension);
    const isValidMime = allowedVideoMimeTypes.includes(file.mimetype);

    if (!isValidExtension || !isValidMime) {
      return cb(
        new Error("Formato de vídeo inválido. Envie apenas MP4, WEBM ou MOV."),
      );
    }

    return cb(null, true);
  }

  if (file.fieldname === "thumbnail") {
    const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    const isValidExtension = allowedImageExtensions.includes(extension);
    const isValidMime = allowedImageMimeTypes.includes(file.mimetype);

    if (!isValidExtension || !isValidMime) {
      return cb(
        new Error(
          "Formato de imagem inválido. Envie apenas JPG, JPEG, PNG ou WEBP.",
        ),
      );
    }

    return cb(null, true);
  }

  return cb(new Error("Campo de upload desconhecido."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 2,
  },
});

module.exports = upload;
