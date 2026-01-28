const express = require('express');
const fs = require('fs');
const multer = require('multer');
const caminho = require('path');
const { criptografar, descriptografar } = require('./criptografia');

const aplicativo = express();
const porta = 5501;
const caminhoRaiz = caminho.join(__dirname, '../../');

// Configurações iniciais ⚙️
aplicativo.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

aplicativo.use(express.json());
aplicativo.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos - ordem importante!
aplicativo.use(express.static(caminho.join(caminhoRaiz, 'publico')));  // Site público
aplicativo.use(express.static(caminho.join(caminhoRaiz, 'adm')));      // Painel admin

// Configuração de Armazenamento de Mídia (Imagens e Vídeos) 🎥
const armazenamento = multer.diskStorage({
    destination: (req, arquivo, carregar) => {
        carregar(null, caminho.join(caminhoRaiz, 'publico/assets/'));
    },
    filename: (req, arquivo, carregar) => {
        const nome_unico = Date.now() + '-' + arquivo.originalname;
        carregar(null, nome_unico);
    }
});
const upload = multer({ storage: armazenamento });

// --- Lógica de Banco de Dados Simples ---

const obter_dados = () => JSON.parse(fs.readFileSync(caminho.join(caminhoRaiz, 'dados_do_site.json'), 'utf-8'));
const salvar_dados = (dados) => fs.writeFileSync(caminho.join(caminhoRaiz, 'dados_do_site.json'), JSON.stringify(dados, null, 2));

// --- Função para Obter Credenciais Descriptografadas ---
const obter_credenciais = () => {
    const credenciais_criptografadas = JSON.parse(fs.readFileSync(caminho.join(__dirname, 'credenciais.json'), 'utf-8'));
    return {
        login: descriptografar(credenciais_criptografadas.login),
        senha: descriptografar(credenciais_criptografadas.senha)
    };
};

// --- Rotas ---

// Rota para o site carregar as informações 📖
aplicativo.get('/obter-conteudo', (req, res) => {
    res.json(obter_dados());
});

// Rota de Login 🔐
aplicativo.post('/validar-login', (req, res) => {
    try {
        const { login, senha } = req.body;

        // Validação básica
        if (!login || !senha) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: 'Login e senha são obrigatórios!' 
            });
        }

        // Obter credenciais descriptografadas
        const credenciais = obter_credenciais();

        // Comparar credenciais
        if (login === credenciais.login && senha === credenciais.senha) {
            res.json({ 
                sucesso: true, 
                mensagem: 'Login realizado com sucesso! ✅',
                token: 'autenticado'
            });
        } else {
            res.status(401).json({ 
                sucesso: false, 
                mensagem: 'Login ou senha incorretos! ❌' 
            });
        }
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ 
            sucesso: false, 
            mensagem: 'Erro ao processar login.' 
        });
    }
});

// Rota Genérica para Atualizar Seções ✍️
// Usamos .any() para aceitar qualquer nome de campo de arquivo vindo do FormData
aplicativo.post('/atualizar-secao', upload.any(), (req, res) => {
    try {
        const novos_textos = req.body;
        const arquivos_enviados = req.files || [];
        let dados_globais = obter_dados();

        console.log('📝 Dados recebidos:', novos_textos);
        console.log('📸 Arquivos recebidos:', arquivos_enviados.length);

        // 1. Processar Textos: Atualiza os valores mantendo a estrutura aninhada
        Object.keys(novos_textos).forEach(chave => {
            // Procura a chave em todas as seções aninhadas
            let encontrou = false;
            for (let secao in dados_globais) {
                if (typeof dados_globais[secao] === 'object' && dados_globais[secao] !== null) {
                    if (chave in dados_globais[secao]) {
                        dados_globais[secao][chave] = novos_textos[chave];
                        encontrou = true;
                        break;
                    }
                } else if (secao === chave) {
                    dados_globais[chave] = novos_textos[chave];
                    encontrou = true;
                    break;
                }
            }
            
            // Se não encontrou em nenhuma seção, cria no nível raiz
            if (!encontrou) {
                dados_globais[chave] = novos_textos[chave];
            }
        });

        // 2. Processar Arquivos: Se houver upload, atualizamos o caminho no JSON
        arquivos_enviados.forEach(arquivo => {
            const caminho_arquivo = `assets/${arquivo.filename}`;
            let encontrou = false;
            
            // Procura em seções aninhadas
            for (let secao in dados_globais) {
                if (typeof dados_globais[secao] === 'object' && dados_globais[secao] !== null) {
                    if (arquivo.fieldname in dados_globais[secao]) {
                        dados_globais[secao][arquivo.fieldname] = caminho_arquivo;
                        encontrou = true;
                        break;
                    }
                }
            }
            
            // Se não encontrou, atualiza no nível raiz
            if (!encontrou) {
                dados_globais[arquivo.fieldname] = caminho_arquivo;
            }
        });

        salvar_dados(dados_globais);
        res.json({ mensagem: "Conteúdo atualizado com sucesso! ✅" });
        
    } catch (erro) {
        console.error('Erro:', erro);
        res.status(500).json({ mensagem: "Erro ao salvar os dados. ❌" });
    }
});

const servidor = aplicativo.listen(porta, '127.0.0.1', () => {
    console.log(`✅ Servidor rodando em http://127.0.0.1:${porta}`);
    console.log(`📌 Pressione Ctrl+C para parar o servidor...`);
});

// Captura o sinal de interrupção (Ctrl+C) para parar gracefully
process.on('SIGINT', () => {
    console.log('\n⏹️  Parando o servidor...');
    servidor.close(() => {
        console.log('✔️  Servidor fechado com sucesso!');
        process.exit(0);
    });
});