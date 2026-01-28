/**
 * Lógica de Login - Validação e Autenticação
 */

document.addEventListener('DOMContentLoaded', () => {
    const formularioLogin = document.getElementById('formulario-login');
    
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', validarLogin);
    }
});

/**
 * Valida as credenciais enviadas
 * @param {Event} evento - Evento do formulário
 */
async function validarLogin(evento) {
    evento.preventDefault();
    
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const mensagem = document.getElementById('mensagem-erro');

    // Validação básica no cliente
    if (!login || !senha) {
        exibirMensagem('Por favor, preencha todos os campos!', 'erro', mensagem);
        return;
    }

    try {
        // Enviar para o servidor
        const resposta = await fetch('http://127.0.0.1:5501/validar-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, senha })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            // Salvar token no localStorage
            localStorage.setItem('token_autenticacao', dados.token);
            
            exibirMensagem('✅ ' + dados.mensagem, 'sucesso', mensagem);
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = '/painel.html';
            }, 1000);
        } else {
            exibirMensagem('❌ ' + dados.mensagem, 'erro', mensagem);
        }
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        exibirMensagem('Erro ao conectar com o servidor!', 'erro', mensagem);
    }
}

/**
 * Exibe mensagem de feedback
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo: 'erro' ou 'sucesso'
 * @param {HTMLElement} elemento - Elemento para exibir mensagem
 */
function exibirMensagem(texto, tipo, elemento) {
    if (!elemento) return;
    
    elemento.textContent = texto;
    elemento.className = 'mensagem ' + tipo;
    elemento.style.display = 'block';
}

/**
 * Verifica se o usuário está autenticado (para proteger a página admin)
 */
function verificarAutenticacao() {
    const token = localStorage.getItem('token_autenticacao');
    const paginaAtual = window.location.pathname;

    // Se está na página admin e não tem token, redireciona para login
    if (paginaAtual.includes('painel.html') && !token) {
        window.location.href = '/login.html';
    }
}

/**
 * Faz logout do usuário
 */
function fazerLogout() {
    localStorage.removeItem('token_autenticacao');
    window.location.href = '/login.html';
}

// Verificar autenticação ao carregar a página
verificarAutenticacao();
