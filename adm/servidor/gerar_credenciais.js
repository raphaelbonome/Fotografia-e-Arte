const fs = require('fs');
const path = require('path');
const { criptografar } = require('./criptografia');

// Dados das credenciais
const credenciais = {
    login: 'admin',
    senha: 'admin'
};

// Criptografar login e senha
const credenciaisCriptografadas = {
    login: criptografar(credenciais.login),
    senha: criptografar(credenciais.senha)
};

// Salvar em arquivo JSON
const caminhoCredenciais = path.join(__dirname, 'credenciais.json');
fs.writeFileSync(caminhoCredenciais, JSON.stringify(credenciaisCriptografadas, null, 2));

console.log('✅ Arquivo de credenciais criptografadas gerado com sucesso!');
console.log(`📁 Localização: ${caminhoCredenciais}`);
console.log('\nCredenciais padrão (serão substituídas depois):');
console.log('Login: admin');
console.log('Senha: admin');
