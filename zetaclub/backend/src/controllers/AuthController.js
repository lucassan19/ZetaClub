const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  console.log("--- ENTRADA LOGIN API ---");
  try {
    const { username, password } = req.body;

    // Verificação básica de admin via .env
    const envUser = (process.env.ADMIN_USER || "Lsz1n.@*22").trim();
    const envPass = (process.env.ADMIN_PASS || "Succ&$22*.@2026d1n").trim();

    console.log("--- DEBUG LOGIN ---");
    console.log("Body recebido:", {
      username,
      passwordLength: password?.length,
    });
    console.log("Esperado do .env:", {
      envUser,
      envPassLength: envPass?.length,
    });

    // Se o usuário não bater, bloqueia logo
    if (username?.toLowerCase().trim() !== envUser.toLowerCase()) {
      console.log("ERRO: Usuário não confere");
      return res.status(401).json({ message: "Usuário incorreto" });
    }

    // Verifica a senha
    let isMatch = false;
    if (envPass.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, envPass);
    } else {
      isMatch = password === envPass;
    }

    console.log("Resultado comparação senha:", isMatch);

    if (isMatch) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET || "67videos_secret_fallback",
        { expiresIn: "8h" },
      );
      console.log("Login realizado com sucesso. Token gerado.");
      return res.json({ token });
    }

    console.log("ERRO: Senha incorreta");
    res.status(401).json({ message: "Senha incorreta" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

exports.verify = (req, res) => {
  res.json({ valid: true });
};
