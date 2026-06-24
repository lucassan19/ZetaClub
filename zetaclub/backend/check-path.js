
const path = require('path');
const fs = require('fs');

// Simulando o __dirname de src/models/index.js
const modelsDirname = path.join(__dirname, 'src', 'models');
const computedPath = path.join(modelsDirname, '../../database.sqlite');
const realPath = path.join(__dirname, 'database.sqlite');

console.log('=== VERIFICAÇÃO DE CAMINHOS ===');
console.log('__dirname do models/index.js:', modelsDirname);
console.log('Caminho calculado pelo código:', computedPath);
console.log('Caminho real do banco:', realPath);
console.log('');
console.log('Arquivo calculado existe?', fs.existsSync(computedPath) ? 'SIM' : 'NÃO');
console.log('Arquivo real existe?', fs.existsSync(realPath) ? 'SIM' : 'NÃO');
