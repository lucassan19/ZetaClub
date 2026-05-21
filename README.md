# ZetaClub

Aqui está a documentação completa e detalhada do projeto **ZetaClub**. Esta guia explica a arquitetura, a função de cada arquivo e como o sistema opera como um todo.

---

# 📘 Documentação ZetaClub

O **ZetaClub** é uma plataforma de streaming de vídeo profissional, construída com foco em performance, segurança e escalabilidade. O sistema utiliza uma arquitetura separada entre **Frontend (React)** e **Backend (Node.js)**.

---

## 🏗️ Estrutura de Pastas (Visão Geral)

```text
/zetaclub
  ├── /backend          # Servidor, API e Banco de Dados
  └── /frontend         # Interface do Usuário (SPA)
```

---

## 🔙 Backend (O Motor do Sistema)

Localizado em `/backend`, utiliza **Express** para rotas e **Sequelize** para gerenciar o banco de dados **SQLite**.

### **Arquivos Principais**
- [server.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/server.js): O ponto de entrada. Configura o servidor, ativa as proteções de segurança (Helmet, CORS, Rate Limit) e conecta ao banco de dados.
- [.env](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/.env): Armazena chaves secretas e configurações sensíveis (não deve ser compartilhado).

### **📁 src/models (Banco de Dados)**
- [index.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/models/index.js): Inicializa o Sequelize e define os relacionamentos entre Vídeos e Categorias.
- [Video.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/models/Video.js): Define a estrutura do vídeo (título, views, url HLS, status de processamento).
- [Category.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/models/Category.js): Define as categorias (Aulas, Tutoriais, etc).
- [ViewLog.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/models/ViewLog.js): Registra visualizações de forma anônima (hash de IP) para evitar spam de views.

### **📁 src/controllers (Lógica de Negócio)**
- [VideoController.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/controllers/VideoController.js): Gerencia o CRUD de vídeos, a contagem de views e a geração de estatísticas para o gráfico.
- [CategoryController.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/controllers/CategoryController.js): Gerencia a criação e exclusão de categorias.
- [AuthController.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/controllers/AuthController.js): Realiza o login do administrador comparando senhas (com suporte a hash bcrypt) e gerando o token JWT.

### **📁 src/middlewares (Segurança e Processamento)**
- [auth.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/middlewares/auth.js): Verifica se o token JWT é válido antes de permitir acesso a rotas admin.
- [security.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/middlewares/security.js): Aplica Helmet (proteção HTTP) e Rate Limit (bloqueia ataques de força bruta no login).
- [validation.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/middlewares/validation.js): Limpa e valida os textos enviados nos formulários (evita scripts maliciosos).
- [upload.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/middlewares/upload.js): Configura o Multer para salvar arquivos com nomes aleatórios e verificar se o arquivo é realmente um vídeo ou imagem.

### **📁 src/utils (Ferramentas)**
- [VideoProcessor.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/utils/VideoProcessor.js): Utiliza o **FFmpeg** para converter o vídeo original em 480p, 720p e 1080p, criando os arquivos `.m3u8` para streaming HLS.

---

## 🎨 Frontend (A Interface)

Localizado em `/frontend`, construído com **React.js** e estilizado com **Tailwind CSS**.

### **📁 src/pages (Telas)**
- [AgeVerification.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/AgeVerification.jsx): Tela obrigatória de entrada que avisa sobre conteúdo adulto.
- [Home.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/Home.jsx): Galeria de vídeos com filtros de categoria, busca e paginação ("Carregar mais").
- [VideoPlayer.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/VideoPlayer.jsx): Player avançado que suporta HLS. Escolhe a qualidade automaticamente ou manual (engrenagem).
- [AdminLogin.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/AdminLogin.jsx): Tela de acesso restrito ao painel.
- [AdminDashboard.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/AdminDashboard.jsx): Painel com gráficos de visualizações, lista de vídeos e gerenciamento de categorias.

### **📁 src/components (Componentes Reutilizáveis)**
- [Navbar.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/components/Navbar.jsx): Menu superior com busca. Identifica se você é admin para mostrar o botão de "Sair".
- [ProtectedRoute.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/components/ProtectedRoute.jsx): Bloqueia o acesso ao painel se o usuário não tiver um token válido.

### **📁 src/services**
- [api.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/services/api.js): Configura o Axios para conversar com o backend, enviando o token automaticamente e tratando erros de "Sessão Expirada".

---

## 🚀 Como Tudo Funciona (O Fluxo)

1.  **Acesso**: O usuário entra no site -> O [App.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/App.jsx) verifica se ele já confirmou a idade -> Se não, mostra o [AgeVerification.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/AgeVerification.jsx).
2.  **Upload**: O Admin sobe um vídeo -> O [upload.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/middlewares/upload.js) valida o arquivo -> O [VideoController.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/controllers/VideoController.js) salva no banco -> O [VideoProcessor.js](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/backend/src/utils/VideoProcessor.js) começa a converter para 1080p/720p/480p em segundo plano.
3.  **Reprodução**: O usuário clica no vídeo -> O [VideoPlayer.jsx](file:///c:/Users/lucas/Desktop/ZetaClub/zetaclub/frontend/src/pages/VideoPlayer.jsx) tenta carregar o HLS otimizado -> Se não estiver pronto, toca o MP4 original (Fallback) -> Uma view é contabilizada no banco se o IP não tiver visto o vídeo nos últimos 30 minutos.

---

## 🛠️ Comandos de Execução

**No Backend:**
```bash
cd zetaclub/backend
npm install
npm run dev
```

**No Frontend:**
```bash
cd zetaclub/frontend
npm install
npm run dev
```

**Requisitos do Sistema:**
- **Node.js**: Para rodar o ambiente.
- **FFmpeg**: Instalado no Windows para habilitar a troca de qualidades (480p, 720p, 20p, 1080p).

Esta estrutura garante que o **ZetaClub** seja rápido, seguro e fácil de manter!
