// Selecionamos todos os formulários que têm a classe de auto-envio
const todos_os_formularios = document.querySelectorAll('.formulario-auto-envio');

todos_os_formularios.forEach(formulario => {
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página

        // O FormData é inteligente: ele detecta automaticamente 
        // se o input é 'text' ou 'file' e empacota tudo corretamente.
        const pacote_de_dados = new FormData(formulario);

        try {
            const resposta = await fetch('/atualizar-secao', {
                method: 'POST',
                body: pacote_de_dados
            });

            const resultado = await resposta.json();
            alert(resultado.mensagem);
        } catch (erro) {
            console.error("Erro na comunicação:", erro);
            alert("Não foi possível conectar ao servidor. ❌");
        }
    });
});





