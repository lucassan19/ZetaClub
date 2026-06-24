const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔍 ==== AUDITORIA DO BANCO DE DADOS ====');

// Caminhos possíveis para o banco de dados
const dbPaths = [
  path.join(__dirname, '../database.sqlite'),
  path.join(__dirname, '../../database.sqlite'),
  path.join(__dirname, '../../../database.sqlite'),
];

console.log('\n📁 Procurando bancos de dados em:');
dbPaths.forEach(dbPath => {
  const exists = fs.existsSync(dbPath);
  console.log(`   ${dbPath}: ${exists ? '✅ EXISTE' : '❌ NÃO EXISTE'}`);
});

const existingDbPath = dbPaths.find(p => fs.existsSync(p));

if (!existingDbPath) {
  console.error('\n❌ Nenhum banco de dados encontrado!');
  process.exit(1);
}

console.log(`\n✅ Usando banco de dados: ${existingDbPath}`);

const db = new sqlite3.Database(existingDbPath);

// 1. Verificar tabelas existentes
console.log('\n📋 Tabelas no banco de dados:');
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Erro ao listar tabelas:', err);
    return;
  }
  
  tables.forEach(table => {
    console.log(`   - ${table.name}`);
  });

  // 2. Verificar total de registros na tabela Videos
  console.log('\n📊 Total de registros na tabela Videos:');
  db.get("SELECT COUNT(*) as total FROM Videos", (err, result) => {
    if (err) {
      console.error('Erro ao contar vídeos:', err);
      return;
    }
    console.log(`   Total: ${result.total}`);

    // 3. Listar todos os vídeos
    console.log('\n🎬 Lista de vídeos (ID, Title, Status):');
    db.all("SELECT id, title, status, thumbnailUrl FROM Videos ORDER BY id", (err, videos) => {
      if (err) {
        console.error('Erro ao listar vídeos:', err);
        return;
      }

      videos.forEach(v => {
        console.log(`   [ID ${v.id}] ${v.title} (status: ${v.status}) - thumb: ${v.thumbnailUrl ? '✅' : '❌'}`);
      });

      // 4. Verificar estrutura da tabela Videos
      console.log('\n🏗️  Estrutura da tabela Videos:');
      db.all("PRAGMA table_info(Videos)", (err, columns) => {
        if (err) {
          console.error('Erro ao verificar estrutura:', err);
          return;
        }
        columns.forEach(col => {
          console.log(`   ${col.name} (${col.type}) - ${col.notnull ? 'NOT NULL' : 'NULL'} - PK: ${col.pk}`);
        });

        db.close();
        console.log('\n🔍 ==== AUDITORIA CONCLUÍDA ====');
      });
    });
  });
});
