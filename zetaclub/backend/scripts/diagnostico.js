const { sequelize, Video, Category } = require('../src/models');
const path = require('path');

console.log('🔍 ==== DIAGNÓSTICO RUNTIME ====');
console.log('\n📁 Caminho do banco de dados configurado no Sequelize:');
console.log('   __dirname =', __dirname);
console.log('   path.join(__dirname, "../../database.sqlite") =', path.join(__dirname, '../../database.sqlite'));
console.log('   sequelize.options.storage =', sequelize.options.storage);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('\n✅ Conexão com o banco estabelecida com sucesso!');

    // 1. Contar registros ANTES
    const countBefore = await Video.count();
    console.log(`\n📊 Total de vídeos na tabela: ${countBefore}`);

    // 2. Listar todos os vídeos
    const videos = await Video.findAll({ include: [Category] });
    console.log('\n🎬 Todos os vídeos no banco:');
    videos.forEach(v => {
      console.log(`   [ID ${v.id}] ${v.title} | status: ${v.status} | thumb: ${v.thumbnailUrl}`);
    });

    await sequelize.close();
    console.log('\n🔍 ==== DIAGNÓSTICO CONCLUÍDO ====');
  } catch (error) {
    console.error('\n❌ Erro no diagnóstico:', error);
  }
})();
