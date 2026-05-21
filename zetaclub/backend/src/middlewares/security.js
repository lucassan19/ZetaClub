const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// Configuração de Rate Limit para Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // limite de 10 tentativas por IP
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de Segurança Global
const securityMiddlewares = [
  helmet({
    contentSecurityPolicy: false, // Necessário para permitir carregar vídeos de outras origens se necessário
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }),
  xss(),
];

module.exports = {
  loginLimiter,
  securityMiddlewares
};
