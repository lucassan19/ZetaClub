const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificação básica de admin via .env
    const envUser = (process.env.ADMIN_USER || '').trim();
    const envPass = (process.env.ADMIN_PASS || '').trim();

    // Se o usuário não bater, bloqueia logo
    if (username?.toLowerCase().trim() !== envUser.toLowerCase()) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verifica a senha
    // Se a senha no .env começar com $2a$ ou $2b$, tratamos como hash bcrypt
    let isMatch = false;
    if (envPass.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, envPass);
    } else {
      // Fallback para texto plano (apenas para facilitar setup inicial do usuário)
      isMatch = (password === envPass);
    }

    if (isMatch) {
      const token = jwt.sign(
        { role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' } // Token expira em 8 horas
      );
      return res.json({ token });
    }

    res.status(401).json({ message: 'Credenciais inválidas' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

exports.verify = (req, res) => {
  res.json({ valid: true });
};
