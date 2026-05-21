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
const PORT = process.env.PORT || 5000;

// Middlewares de Segurança Global
app.use(...securityMiddlewares);

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://seu-dominio.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure upload directories exist
const fs = require('fs');
const uploadDirs = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/videos')
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  
  // Aumentar o timeout para suportar uploads grandes (10 minutos)
  server.timeout = 600000; 
}).catch(err => {
  console.error('Failed to sync database:', err);
});
