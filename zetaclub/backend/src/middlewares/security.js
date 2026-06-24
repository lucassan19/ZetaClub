const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Função para pular Rate Limit em ambiente de desenvolvimento (localhost)
const skipDev = (req) => {
  const ip = req.ip || req.connection.remoteAddress;
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
};

// Configuração de Rate Limit Global (Permissiva para navegação normal)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Aumentado drasticamente para 1000 requisições por IP a cada 15 min
  message: { message: 'Muitas requisições deste IP. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev
});

// Configuração de Rate Limit para Login (Mais restrito)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Aumentado para 15 para evitar bloqueios durante testes
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev
});

// Rate limit para ações de engajamento (likes, views)
const engagementLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 50, // Aumentado para 50
  message: { message: 'Muitas interações em pouco tempo. Aguarde um minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev
});

// Rate limit para uploads (Muito restrito)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, 
  message: { message: 'Limite de uploads por hora atingido.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipDev
});

// Middleware de Segurança Global
const securityMiddlewares = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
  globalLimiter
];

module.exports = {
  loginLimiter,
  engagementLimiter,
  uploadLimiter,
  securityMiddlewares
};
