window.onload = () => {
    // --- LÓGICA DE FILTRO E MODAL (PÁGINA TRABALHOS) ---
    if (document.getElementById('grid-trabalhos')) {
        const botoesFiltr = document.querySelectorAll('.btn-filtro');
        const cards = document.querySelectorAll('.card-trabalho');
        const modal = document.getElementById('modal-trabalho');
        const fecharModal = document.getElementById('fechar-modal-trabalho');
        const botoeAbrir = document.querySelectorAll('.btn-abrir-modal');

        // Filtrar trabalhos
        botoesFiltr.forEach(botao => {
            botao.addEventListener('click', function() {
                // Remove classe ativo de todos
                botoesFiltr.forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');

                const filtro = this.getAttribute('data-filtro');

                cards.forEach(card => {
                    const categoria = card.getAttribute('data-categoria');
                    
                    if (filtro === 'todos') {
                        card.classList.remove('hidden');
                    } else if (categoria === filtro) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        // Abrir modal
        botoeAbrir.forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.preventDefault();
                const titulo = botao.getAttribute('data-titulo');
                const categoria = botao.getAttribute('data-categoria');
                const descricao = botao.getAttribute('data-descricao');
                const imagem = botao.getAttribute('data-imagem');

                document.getElementById('img-modal-trabalho').src = imagem;
                document.getElementById('titulo-modal-trabalho').innerText = titulo;
                document.getElementById('categoria-modal-trabalho').innerText = categoria;
                document.getElementById('descricao-modal-trabalho').innerText = descricao;

                modal.classList.add('aberto');
            });
        });

        // Fechar modal
        fecharModal.addEventListener('click', () => {
            modal.classList.remove('aberto');
        });

        // Fechar modal ao clicar fora
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('aberto');
            }
        });
    }
};

window.onload = () => {
    // --- VARIÁVEIS DE CONTROLE DO CARROSSEL ---
    let imagensAtuais = []; // Lista para guardar as fotos do modal aberto
    let indiceAtual = 0;    // Para saber qual número da foto estamos vendo (0, 1, 2...)

    // --- LÓGICA DE FILTRO E MODAL (PÁGINA TRABALHOS) ---
    if (document.getElementById('grid-trabalhos')) {
        const botoesFiltr = document.querySelectorAll('.btn-filtro');
        const cards = document.querySelectorAll('.card-trabalho');
        const modal = document.getElementById('modal-trabalho');
        const fecharModal = document.getElementById('fechar-modal-trabalho');
        const botoeAbrir = document.querySelectorAll('.btn-abrir-modal');

        // Elementos do Carrossel (Novos)
        const imagemModal = document.getElementById('img-modal-trabalho');
        const btnAnterior = document.getElementById('btn-anterior');
        const btnProximo = document.getElementById('btn-proximo');

        // --- FUNÇÃO: Atualizar a imagem na tela ---
        const atualizarImagemModal = () => {
            imagemModal.src = imagensAtuais[indiceAtual];
        };

        // --- EVENTO: Clicar no botão "Próximo" ---
        if (btnProximo) {
            btnProximo.addEventListener('click', () => {
                indiceAtual++; // Aumenta 1
                // Se o índice passar do tamanho da lista, volta para o 0 (início)
                if (indiceAtual >= imagensAtuais.length) {
                    indiceAtual = 0;
                }
                atualizarImagemModal();
            });
        }

        // --- EVENTO: Clicar no botão "Anterior" ---
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => {
                indiceAtual--; // Diminui 1
                // Se for menor que 0, vai para a última foto da lista
                if (indiceAtual < 0) {
                    indiceAtual = imagensAtuais.length - 1;
                }
                atualizarImagemModal();
            });
        }

        // --- FILTRO DE TRABALHOS (Mantido igual) ---
        botoesFiltr.forEach(botao => {
            botao.addEventListener('click', function() {
                botoesFiltr.forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');
                const filtro = this.getAttribute('data-filtro');

                cards.forEach(card => {
                    const categoria = card.getAttribute('data-categoria');
                    if (filtro === 'todos' || categoria === filtro) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });

        // --- ABRIR MODAL (Atualizado com lógica de lista) ---
        botoeAbrir.forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.preventDefault();

                const titulo = botao.getAttribute('data-titulo');
                const categoria = botao.getAttribute('data-categoria');
                const descricao = botao.getAttribute('data-descricao');
                
                // Tenta pegar a lista de várias imagens
                const listaImagensTexto = botao.getAttribute('data-imagens');
                // Pega a imagem única antiga (fallback)
                const imagemUnica = botao.getAttribute('data-imagem');

                // LÓGICA INTELIGENTE:
                // Se tiver lista (data-imagens), usamos ela.
                // Se não, criamos uma lista com a imagem única para não quebrar o código.
                if (listaImagensTexto) {
                    try {
                        imagensAtuais = JSON.parse(listaImagensTexto);
                    } catch (erro) {
                        console.error("Erro ao ler lista de imagens:", erro);
                        imagensAtuais = [imagemUnica];
                    }
                } else {
                    imagensAtuais = [imagemUnica];
                }

                // Reseta para a primeira foto sempre que abrir
                indiceAtual = 0; 

                // Preenche os dados na tela
                atualizarImagemModal(); // Chama a função que criamos acima
                document.getElementById('titulo-modal-trabalho').innerText = titulo;
                document.getElementById('categoria-modal-trabalho').innerText = categoria;
                document.getElementById('descricao-modal-trabalho').innerText = descricao;
                
                // Esconde as setas se tiver só 1 foto
                if (imagensAtuais.length <= 1) {
                    btnAnterior.style.display = 'none';
                    btnProximo.style.display = 'none';
                } else {
                    btnAnterior.style.display = 'block'; // ou 'flex' dependendo do seu CSS
                    btnProximo.style.display = 'block';
                }

                modal.classList.add('aberto');
            });
        });

        // --- FECHAR MODAL ---
        fecharModal.addEventListener('click', () => {
            modal.classList.remove('aberto');
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('aberto');
            }
        });
    }
};