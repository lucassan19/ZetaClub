const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pasta raiz de uploads
    const baseDir = path.join(__dirname, '../../uploads');
    
    // Subpastas específicas para segurança e organização
    const subDir = file.fieldname === 'video' ? 'videos/temp' : 'thumbnails';
    const uploadDir = path.join(baseDir, subDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome aleatório para evitar ataques de caminho e nomes maliciosos
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    const allowedExtensions = ['.mp4', '.webm', '.mov'];
    const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de vídeo inválido. Apenas MP4, WEBM e MOV são permitidos.'));
    }
  } else if (file.fieldname === 'thumbnail') {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagem inválido. Apenas JPG, PNG e WEBP são permitidos.'));
    }
  } else {
    cb(new Error('Campo de upload desconhecido.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // Limite de 1GB para vídeos
    files: 2 // No máximo 2 arquivos por requisição (vídeo + thumb)
  }
});

module.exports = upload;
