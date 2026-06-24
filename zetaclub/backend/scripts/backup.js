const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de Backup Nativo do ZetaClub
 * Realiza cópia do banco SQLite e compactação da pasta uploads.
 */

const BACKUP_DIR = path.join(__dirname, 'backups');
const DB_PATH = path.join(__dirname, 'database.sqlite');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);

async function runBackup() {
  console.log(`[${new Date().toISOString()}] Iniciando backup do sistema...`);

  try {
    // 1. Backup do Banco de Dados
    if (fs.existsSync(DB_PATH)) {
      const dbDest = path.join(BACKUP_DIR, 'database', `database-${timestamp}.sqlite`);
      fs.copyFileSync(DB_PATH, dbDest);
      console.log(`✅ Banco de dados copiado para: ${path.basename(dbDest)}`);
    }

    // 2. Backup da Pasta Uploads (Usando comando nativo do SO para evitar libs externas)
    const uploadsDest = path.join(BACKUP_DIR, 'uploads', `uploads-${timestamp}.zip`);
    
    if (process.platform === 'win32') {
      // Windows PowerShell para zipar
      execSync(`powershell Compress-Archive -Path "${UPLOADS_DIR}" -DestinationPath "${uploadsDest}" -Force`);
    } else {
      // Linux/Unix zip
      execSync(`zip -r "${uploadsDest}" "${UPLOADS_DIR}"`);
    }
    
    console.log(`✅ Pasta uploads compactada em: ${path.basename(uploadsDest)}`);
    console.log(`--- Backup concluído com sucesso ---`);

  } catch (error) {
    console.error(`❌ Erro durante o backup:`, error.message);
    process.exit(1);
  }
}

runBackup();
