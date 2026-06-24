require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { securityMiddlewares } = require('./src/middlewares/security');
const { sequelize } = require('./src/models');

const videoRoutes = require('./src/routes/videoRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.set('trust proxy', 1); // Confiar no primeiro proxy (Nginx, Cloudflare, etc) para Rate Limit
app.set('query parser', 'simple'); // Use a simpler query parser to avoid "Cannot set property query" error
const PORT = process.env.PORT || 5000;

// Cache-Control headers para evitar cache de dados antigos
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// 1. CORS deve vir primeiro para lidar com preflight
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parsers antes de outros middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. Middlewares de Segurança Global Reativados
securityMiddlewares.forEach(mw => app.use(mw));

// Ensure upload directories exist
const fs = require('fs');
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/temp'),
  path.join(__dirname, 'uploads/videos'),
  path.join(__dirname, 'uploads/thumbnails'),
  path.join(__dirname, 'backups'),
  path.join(__dirname, 'backups/database'),
  path.join(__dirname, 'backups/uploads')
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Routes
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'O arquivo é muito grande. O limite máximo é de 1GB.'
    });
  }

  // Erros de Multer ou validação customizada
  if (err instanceof Error && (err.message.includes('Formato') || err.message.includes('upload'))) {
    return res.status(400).json({ message: err.message });
  }

  // Log interno (não exposto ao cliente em produção)
  console.error('SERVER_ERROR:', err.stack);

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Ocorreu um erro interno no servidor.' 
    : err.message;

  res.status(status).json({ message });
});

// Database Sync & Start Server
sequelize.sync().then(() => {
  console.log('Database synced successfully');
  
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[FATAL] Porta ${PORT} já está em uso.`);
      console.error(`[SOLUÇÃO] Feche o processo antigo ou altere a variável PORT no arquivo .env.\n`);
      process.exit(1);
    } else {
      console.error('SERVER_START_ERROR:', err);
    }
  });
  
  server.timeout = 600000; 
}).catch(err => {
  console.error('Failed to sync database:', err);
});
