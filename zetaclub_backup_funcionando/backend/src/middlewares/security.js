const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configuração de Rate Limit Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP a cada 15 min
  message: { message: 'Muitas requisições deste IP. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuração de Rate Limit para Login (Mais restrito)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Aumentado para 10 para evitar bloqueios durante testes
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
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
  securityMiddlewares
};
