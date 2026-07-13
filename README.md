# 67videos

Plataforma de streaming de vídeo profissional com foco em performance, segurança e escalabilidade. Arquitetura separada entre **Frontend (React)** e **Backend (Node.js)**.  

---

## 🏗️ Estrutura de Pastas (Visão Geral)

```text
/ZetaClub
  ├── /zetaclub          # Diretório do Projeto
  │   ├── /backend          # Servidor, API e Banco de Dados
  │   └── /frontend         # Interface do Usuário (SPA)
  └── README.md          # Este arquivo
```

---

## 🔙 Backend (O Motor do Sistema)

Localizado em `/zetaclub/backend`, utiliza **Express** para rotas e **Sequelize** para gerenciar o banco de dados **SQLite**.

### **Arquivos Principais**

- [server.js](file:///c:/ZetaClub/zetaclub/backend/server.js): O ponto de entrada. Configura o servidor, ativa as proteções de segurança (Helmet, CORS, Rate Limit, Trust Proxy) e conecta ao banco de dados.
- [.env](file:///c:/ZetaClub/zetaclub/backend/.env): Armazena chaves secretas e configurações sensíveis (não deve ser compartilhado).
- [scripts/backup.js](file:///c:/ZetaClub/zetaclub/backend/scripts/backup.js): Script nativo de backup automático para banco de dados e uploads.

### **📁 src/models (Banco de Dados)**

- [index.js](file:///c:/ZetaClub/zetaclub/backend/src/models/index.js): Inicializa o Sequelize e define os relacionamentos entre Vídeos e Categorias (incluindo cascata de exclusão).
- [Video.js](file:///c:/ZetaClub/zetaclub/backend/src/models/Video.js): Define a estrutura do vídeo (título, views, url HLS, status de processamento, likes, dislikes).
- [Category.js](file:///c:/ZetaClub/zetaclub/backend/src/models/Category.js): Define as categorias.
- [ViewLog.js](file:///c:/ZetaClub/zetaclub/backend/src/models/ViewLog.js): Registra visualizações de forma anônima (hash de IP) para evitar spam de views.
- [Favorite.js](file:///c:/ZetaClub/zetaclub/backend/src/models/Favorite.js): Gerencia os vídeos favoritos dos usuários (anônimos via deviceId).
- [Progress.js](file:///c:/ZetaClub/zetaclub/backend/src/models/Progress.js): Salva o progresso de reprodução ("Continuar assistindo").
- [VideoReaction.js](file:///c:/ZetaClub/zetaclub/backend/src/models/VideoReaction.js): Armazena likes/dislikes individuais por dispositivo, evitando votos duplicados.

### **📁 src/controllers (Lógica de Negócio)**

- [VideoController.js](file:///c:/ZetaClub/zetaclub/backend/src/controllers/VideoController.js): Gerencia o CRUD de vídeos, a contagem de views, likes/dislikes, favoritos e progresso.
- [CategoryController.js](file:///c:/ZetaClub/zetaclub/backend/src/controllers/CategoryController.js): Gerencia a criação e exclusão de categorias.
- [AuthController.js](file:///c:/ZetaClub/zetaclub/backend/src/controllers/AuthController.js): Realiza o login do administrador comparando senhas (com suporte a hash bcrypt) e gerando o token JWT.

### **📁 src/middlewares (Segurança e Processamento)**

- [auth.js](file:///c:/ZetaClub/zetaclub/backend/src/middlewares/auth.js): Verifica se o token JWT é válido e se o usuário tem permissão de admin.
- [security.js](file:///c:/ZetaClub/zetaclub/backend/src/middlewares/security.js): Aplica Helmet (proteção HTTP) e Rate Limit (bloqueia ataques de força bruta no login, upload e engajamento).
- [validation.js](file:///c:/ZetaClub/zetaclub/backend/src/middlewares/validation.js): Limpa e valida os textos enviados nos formulários.
- [upload.js](file:///c:/ZetaClub/zetaclub/backend/src/middlewares/upload.js): Configura o Multer para salvar arquivos com nomes aleatórios e verificar se o arquivo é realmente um vídeo ou imagem.

### **📁 src/utils (Ferramentas)**

- [VideoProcessor.js](file:///c:/ZetaClub/zetaclub/backend/src/utils/VideoProcessor.js): Utiliza o **FFmpeg** para converter o vídeo original em 480p, 720p e 1080p, criando os arquivos `.m3u8` para streaming HLS, além de gerar thumbnails automáticas.

---

## 🎨 Frontend (A Interface)

Localizado em `/zetaclub/frontend`, construído com **React.js** e estilizado com **Tailwind CSS**.

### **📁 src/pages (Telas)**

- [AgeVerification.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/AgeVerification.jsx): Tela obrigatória de entrada que avisa sobre conteúdo adulto.
- [Home.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/Home.jsx): Galeria de vídeos com filtros de categoria, busca com debounce, ordenação (recentes, mais vistos, mais curtidos) e skeletons de loading.
- [VideoPlayer.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/VideoPlayer.jsx): Player avançado com otimizações de performance, suporte HLS, likes/dislikes, favoritos e progresso de reprodução automático. Botão de download removido.
- [Favorites.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/Favorites.jsx): Lista de vídeos salvos como favoritos.
- [AdminLogin.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/AdminLogin.jsx): Tela de acesso restrito ao painel.
- [AdminDashboard.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/AdminDashboard.jsx): Painel com gráficos de visualizações, lista de vídeos e gerenciamento de categorias.
- [TermsOfUse.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/TermsOfUse.jsx): Página de Termos de Uso (legal).
- [PrivacyPolicy.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/PrivacyPolicy.jsx): Página de Política de Privacidade (legal).
- [Contact.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/Contact.jsx): Página de Contato.

### **📁 src/components (Componentes Reutilizáveis)**

- [PublicNavbar.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/components/PublicNavbar.jsx): Menu superior com busca, link para Favoritos e Histórico. Botão Admin removido da interface pública.
- [PublicLayout.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/layouts/PublicLayout.jsx): Layout principal da área pública, contendo navbar e rodapé com links para as páginas legais (Termos de Uso, Política de Privacidade e Contato).
- [ProtectedRoute.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/components/ProtectedRoute.jsx): Bloqueia o acesso ao painel se o usuário não tiver um token válido.

### **📁 src/services**

- [api.js](file:///c:/ZetaClub/zetaclub/frontend/src/services/api.js): Configura o Axios para conversar com o backend, gerencia o deviceId para persistência anônima, envia o token automaticamente e trata erros de "Sessão Expirada".

---

## 🚀 Como Tudo Funciona (O Fluxo)

1.  **Acesso**: O usuário entra no site -> O [App.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/App.jsx) verifica se ele já confirmou a idade -> Se não, mostra o [AgeVerification.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/AgeVerification.jsx).
2.  **Upload**: O Admin sobe um vídeo -> O [upload.js](file:///c:/ZetaClub/zetaclub/backend/src/middlewares/upload.js) valida o arquivo e salva em `uploads/temp` -> O [VideoController.js](file:///c:/ZetaClub/zetaclub/backend/src/controllers/VideoController.js) salva no banco com status `processing` -> Move o arquivo para `uploads/videos/{id}` -> O [VideoProcessor.js](file:///c:/ZetaClub/zetaclub/backend/src/utils/VideoProcessor.js) começa a converter para 1080p/720p/480p em segundo plano -> Ao finalizar, status muda para `ready` e master.m3u8 está disponível.
3.  **Reprodução**: O usuário clica no vídeo -> O [VideoPlayer.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/VideoPlayer.jsx) tenta carregar o HLS otimizado -> Salva automaticamente o progresso em tempo real -> Uma view é contabilizada no banco se o IP não tiver visto o vídeo nos últimos 30 minutos.
4.  **Likes/Favoritos**: A interação é salva no banco associada ao `deviceId` do navegador, permitindo persistência sem autenticação.

---

## 🔑 Rotas de Acesso (URLs)

### Área Pública
- **Página de Entrada (Verificação de Idade)**: http://localhost:5173/age-verification
  - Nota: O sistema redirecionará você automaticamente para cá no primeiro acesso.
- **Biblioteca de Vídeos (Home)**: http://localhost:5173/
- **Favoritos**: http://localhost:5173/favorites
- **Termos de Uso**: http://localhost:5173/terms-of-use
- **Política de Privacidade**: http://localhost:5173/privacy-policy
- **Contato**: http://localhost:5173/contact

### Área Administrativa (Acesso Restrito)
- **Página de Login**: http://localhost:5173/d9a71f2c6e84b5a3
  - Nota: Esta rota é SECRETA e escondida! Não há botão público para ela. Você deve digitar o endereço diretamente no navegador.
- **Painel Administrativo**: http://localhost:5173/d9a71f2c6e84b5a3/dashboard

### Credenciais Padrão do Administrador
As credenciais são configuradas no arquivo [.env](file:///c:/ZetaClub/zetaclub/backend/.env). Os valores padrão (fallback) são:
- **Usuário**: `admin`
- **Senha**: `admin123`

**Alterando Credenciais:**
1.  Edite as linhas `ADMIN_USER` e `ADMIN_PASS` no arquivo [.env](file:///c:/ZetaClub/zetaclub/backend/.env).
2.  Reinicie o servidor backend.
3.  A senha pode ser inserida em texto puro ou como hash bcrypt para maior segurança.

---

## 🛡️ Segurança

### Proteções Implementadas
- **Helmet**: Headers de segurança HTTP ativados, com CSP compatível com streaming HLS.
- **Rate Limiting**: Limites diferenciados para login, upload e engajamento para evitar ataques.
- **Trust Proxy**: Configurado para funcionar corretamente atrás de Nginx/Cloudflare na VPS.
- **Proteção de Rotas**: Todas as rotas administrativas exigem token JWT válido e role `admin`. As URLs são secretas e aleatórias para evitar acesso não autorizado.
- **Sanitização de Entrada**: Middleware de validação limpa textos de formulários.
- **Armazenamento de Arquivos**: Arquivos temporários são salvos com nomes aleatórios e movidos para pastas organizadas por ID de vídeo.

---

## 💾 Backup e Recuperação

### Executar Backup Manual
Um script nativo está disponível para backup do banco de dados e da pasta de uploads:
```bash
cd zetaclub/backend
npm run backup
```

### Estrutura de Backup
Os backups são armazenados em:
- `/zetaclub/backend/backups/database/` (ex: `database-2026-06-06-21-00.sqlite`)
- `/zetaclub/backend/backups/uploads/` (ex: `uploads-2026-06-06-21-00.zip`)

### Agendamento na VPS
Para backup automático diário, adicione uma regra no `cron` da VPS:
```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 03:00
0 3 * * * cd /caminho/para/zetaclub/backend && node scripts/backup.js >> /var/log/zetaclub-backup.log 2>&1
```

### Restaurar Backup
1.  **Banco de Dados**: Renomeie o arquivo `.sqlite` de backup para `database.sqlite` e substitua-o na raiz do backend.
2.  **Uploads**: Extraia o conteúdo do arquivo `.zip` de backup para a pasta `uploads/`.

---

## 🛠️ Comandos de Execução

### No Backend:
```bash
cd zetaclub/backend
npm install
npm run dev
```
A API roda por padrão na porta **5000**.

### No Frontend:
```bash
cd zetaclub/frontend
npm install
npm run dev
```
A interface roda por padrão na porta **5173**.

### Requisitos do Sistema:
- **Node.js**: Versão 16 ou superior.
- **FFmpeg**: Instalado no sistema para habilitar a transcodificação HLS.
  - Windows: Baixe do site oficial e adicione ao PATH.
  - Linux (Ubuntu/Debian): `sudo apt-get install ffmpeg`

---

## ⚡ Otimizações de Performance do Player

Foram implementadas otimizações no [VideoPlayer.jsx](file:///c:/ZetaClub/zetaclub/frontend/src/pages/VideoPlayer.jsx) para reduzir o tempo de carregamento inicial, especialmente em dispositivos móveis:

1. **`preload="metadata"`**: Carrega apenas metadados do vídeo (duração, resolução) imediatamente, economizando banda
2. **Evento `loadedmetadata`**: Remove o estado de loading assim que os metadados são recebidos (muito mais rápido que `loadeddata`)
3. **Carregamento Prioritário**: Requisição do vídeo principal é feita primeiro, player renderizado imediatamente, dados secundários carregados em segundo plano

## 📊 Status de Funcionalidades

| Funcionalidade | Status |
| :--- | :--- |
| Upload de Vídeos | ✅ |
| Streaming HLS (480p, 720p, 1080p) | ✅ |
| Fallback MP4 | ✅ |
| Thumbnail Automática | ✅ |
| Likes/Dislikes (sem duplicatas por dispositivo) | ✅ |
| Sistema de Favoritos | ✅ |
| Continuar Assistindo | ✅ |
| Pesquisa com Debounce | ✅ |
| Ordenação de Vídeos | ✅ |
| Skeletons de Loading | ✅ |
| Painel Administrativo | ✅ |
| Middlewares de Segurança | ✅ |
| Backup Automático | ✅ |
| Páginas Legais (Termos, Política, Contato) | ✅ |
| Otimizações de Performance do Player | ✅ |

---

Esta estrutura garante que o **67videos** seja rápido, seguro, estável e fácil de manter!
