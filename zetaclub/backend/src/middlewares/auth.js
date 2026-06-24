const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || '67videos_secret_fallback', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    
    // Garantir que o usuário tem a role de admin para rotas protegidas
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado: permissão de administrador necessária' });
    }
    
    req.user = decoded;
    next();
  });
};
