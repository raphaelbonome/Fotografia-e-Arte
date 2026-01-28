// Selecionando os elementos do carrossel
const carrossel_principal = document.querySelector('.trilho-carrossel');
const carrossel_secundario = document.querySelector('.trilho-carrossel1');

// Selecionando botões de navegação
const btn_proximo = document.getElementById('botao_proximo');
const btn_anterior = document.getElementById('botao_anterior');
const btn_proximo1 = document.getElementById('botao_proximo1');
const btn_anterior1 = document.getElementById('botao_anterior1');

// Selecionando elementos do Modal
const janela_modal = document.getElementById('janela_modal');
const imagem_exibida = document.getElementById('imagem_exibida');
const texto_legenda = document.getElementById('texto_legenda');
const botao_fechar = document.getElementById('botao_fechar');

// Selecionando todas as fotos dos dois carrosséis
const todas_as_fotos = document.querySelectorAll('.foto_carrossel, .foto_carrossel1');

// --- LÓGICA DO CARROSSEL ---

/**
 * Calcula a largura do movimento baseada no tamanho atual da imagem na tela
 */
function calcular_movimento(elemento_carrossel) {
    const primeira_foto = elemento_carrossel.querySelector('img');
    if (primeira_foto) {
        return primeira_foto.clientWidth;
    }
    return 300;
}

// Eventos Carrossel 1
btn_proximo.addEventListener('click', () => {
    carrossel_principal.scrollBy({ left: calcular_movimento(carrossel_principal), behavior: 'smooth' });
});
btn_anterior.addEventListener('click', () => {
    carrossel_principal.scrollBy({ left: -calcular_movimento(carrossel_principal), behavior: 'smooth' });
});

// Eventos Carrossel 2
btn_proximo1.addEventListener('click', () => {
    carrossel_secundario.scrollBy({ left: calcular_movimento(carrossel_secundario), behavior: 'smooth' });
});
btn_anterior1.addEventListener('click', () => {
    carrossel_secundario.scrollBy({ left: -calcular_movimento(carrossel_secundario), behavior: 'smooth' });
});

// --- LÓGICA DO MODAL ---

/**
 * Aplica o evento de clique em todas as fotos para abrir o modal
 */
todas_as_fotos.forEach(foto => {
    foto.addEventListener('click', function() {
        janela_modal.style.display = "block";
        imagem_exibida.src = this.src;
        texto_legenda.innerText = this.getAttribute('data-legenda');
    });
});

// Fechar modal no botão X
botao_fechar.onclick = () => janela_modal.style.display = "none";

// Fechar modal ao clicar fora da imagem (no fundo escuro)
window.onclick = (evento) => {
    if (evento.target == janela_modal) {
        janela_modal.style.display = "none";
    }
};

async function carregarConteudo() {
    try {
        const resposta = await fetch('/obter-conteudo');
        const dados = await resposta.json();
        atualizarLayout(dados);
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

function atualizarLayout(dados) {
    // 1. Cabeçalho e Logo
    const logo = document.querySelector('.logo');
    if (logo && dados.secao_cabecalho.img_1s) {
        logo.src = dados.secao_cabecalho.img_1s;
        if (dados.secao_cabecalho.alt_img_1s) {
            logo.alt = dados.secao_cabecalho.alt_img_1s;
        }
    }

    const el_titulo_1s = document.querySelector('h1');
    if (el_titulo_1s && dados.secao_cabecalho.tamanho_titulo_1s) {
        el_titulo_1s.style.fontSize = dados.secao_cabecalho.tamanho_titulo_1s + 'pt';
    }

    const el_texto_1s = document.querySelector('.texto_cabecalho');
    if (el_texto_1s && dados.secao_cabecalho.tamanho_texto_1s) {
        el_texto_1s.style.fontSize = dados.secao_cabecalho.tamanho_texto_1s + 'pt';
    }

    // 2. Primeiro Carrossel (Topo)
    ['imgem1', 'imgem2', 'imgem3', 'imgem4', 'imgem5', 'imgem6'].forEach((id, idx) => {
        const el = document.getElementById(id);
        const key = `img_carrossel_${idx + 1}`;
        const altKey = `alt_img_carrossel_${idx + 1}`;
        if (el && dados.carrossel_topo[key]) {
            el.src = dados.carrossel_topo[key];
            if (dados.carrossel_topo[altKey]) {
                el.alt = dados.carrossel_topo[altKey];
            }
        }
    });

    // 3. Segundo Carrossel (Trabalhos/Itens)
    for (let i = 1; i <= 3; i++) {
        const item = document.getElementById(`item${i}`);
        if (item) {
            const img = item.querySelector('img');
            const txt = item.querySelector('p');
            const imgKey = `img_carrossel_${i}.2`;
            const altKey = `alt_img_carrossel_${i}.2`;
            const txtKey = `texto-trabalho_${i}`;
            const sizeKey = `tamanho-trabalho_${i}`;
            if (img && dados.trabalhos_carrossel_2[imgKey]) {
                img.src = dados.trabalhos_carrossel_2[imgKey];
                if (dados.trabalhos_carrossel_2[altKey]) {
                    img.alt = dados.trabalhos_carrossel_2[altKey];
                }
            }
            if (txt && dados.trabalhos_carrossel_2[txtKey]) {
                txt.innerText = dados.trabalhos_carrossel_2[txtKey];
                if (dados.trabalhos_carrossel_2[sizeKey]) {
                    txt.style.fontSize = dados.trabalhos_carrossel_2[sizeKey] + 'pt';
                }
            }
        }
    }

    // 4. Seção Quem Somos (2ª Sessão)
    const el_tt_2s = document.getElementById('tt_2s');
    if (el_tt_2s && dados.secao_2.titulo_2s) {
        el_tt_2s.innerText = dados.secao_2.titulo_2s;
        if (dados.secao_2.tamanho_titulo_2s) {
            el_tt_2s.style.fontSize = dados.secao_2.tamanho_titulo_2s + 'pt';
        }
    }

    const el_img_2s_1 = document.getElementById('img_2s-1');
    if (el_img_2s_1 && dados.secao_2.img_2s) {
        el_img_2s_1.src = dados.secao_2.img_2s;
        if (dados.secao_2.alt_img_2s) {
            el_img_2s_1.alt = dados.secao_2.alt_img_2s;
        }
    }

    const el_txt_2s_1 = document.getElementById('txt_2s-1');
    if (el_txt_2s_1 && dados.secao_2.texto_2s) {
        el_txt_2s_1.innerText = dados.secao_2.texto_2s;
        if (dados.secao_2.tamanho_texto_2s) {
            el_txt_2s_1.style.fontSize = dados.secao_2.tamanho_texto_2s + 'pt';
        }
    }

    const el_img_2s_2 = document.getElementById('img_2s-2');
    if (el_img_2s_2 && dados.secao_2['img_2s-2']) {
        el_img_2s_2.src = dados.secao_2['img_2s-2'];
        if (dados.secao_2['alt_img_2s-2']) {
            el_img_2s_2.alt = dados.secao_2['alt_img_2s-2'];
        }
    }

    const el_txt_2s_2 = document.getElementById('txt_2s-2');
    if (el_txt_2s_2 && dados.secao_2['texto_2s-2']) {
        el_txt_2s_2.innerText = dados.secao_2['texto_2s-2'];
        if (dados.secao_2['tamanho_texto_2s-2']) {
            el_txt_2s_2.style.fontSize = dados.secao_2['tamanho_texto_2s-2'] + 'pt';
        }
    }

    // 5. Terceiro Carrossel (Sucesso/Festa)
    const el_titulo_carrossel = document.getElementById('titulo_carrossel');
    if (el_titulo_carrossel && dados.sucesso_carrossel_3.titulo_carrossel) {
        el_titulo_carrossel.innerText = dados.sucesso_carrossel_3.titulo_carrossel;
        if (dados.sucesso_carrossel_3.tamanho_titulo_carrossel) {
            el_titulo_carrossel.style.fontSize = dados.sucesso_carrossel_3.tamanho_titulo_carrossel + 'pt';
        }
    }

    const imgsC = [
        { id: 'img_c1', img: 'img_carrossel_1.3', alt: 'alt_img_carrossel_1.3', txt: 'texto-trabalho_1.3', size: 'tamanho-trabalho_1.3' },
        { id: 'img_c2', img: 'img_carrossel_2.3', alt: 'alt_img_carrossel_2.3', txt: 'texto-trabalho_2.3', size: 'tamanho-trabalho_2.3' },
        { id: 'img_c3', img: 'img_carrossel_3.3', alt: 'alt_img_carrossel_3.3', txt: 'texto-trabalho_3.3', size: 'tamanho-trabalho_3.3' },
        { id: 'img_c4', img: 'img_carrossel_4.3', alt: 'alt_img_carrossel_4.3', txt: 'texto-trabalho_4.3', size: 'tamanho-trabalho_4.3' },
        { id: 'img_c5', img: 'img_carrossel_5.3', alt: 'alt_img_carrossel_5.3', txt: 'texto-trabalho_5.3', size: 'tamanho-trabalho_5.3' },
        { id: 'img_c6', img: 'img_carrossel_6.3', alt: 'alt_img_carrossel_6.3', txt: 'texto-trabalho_6.3', size: 'tamanho-trabalho_6.3' }
    ];

    imgsC.forEach(item => {
        const el = document.getElementById(item.id);
        if (el && dados.sucesso_carrossel_3[item.img] && dados.sucesso_carrossel_3[item.txt]) {
            el.src = dados.sucesso_carrossel_3[item.img];
            if (dados.sucesso_carrossel_3[item.alt]) {
                el.alt = dados.sucesso_carrossel_3[item.alt];
            }
            el.setAttribute('data-legenda', dados.sucesso_carrossel_3[item.txt]);
        }
    });

    // 6. Nossa Trajetória (3ª Sessão)
    const el_tt_3s = document.getElementById('tt_3s');
    if (el_tt_3s && dados.secao_3.titulo_3s) {
        el_tt_3s.innerText = dados.secao_3.titulo_3s;
        if (dados.secao_3.tamanho_titulo_3s) {
            el_tt_3s.style.fontSize = dados.secao_3.tamanho_titulo_3s + 'pt';
        }
    }

    const el_subtt_3s = document.getElementById('subtt_3s');
    if (el_subtt_3s && dados.secao_3.subtt_3s) {
        el_subtt_3s.innerText = dados.secao_3.subtt_3s;
        if (dados.secao_3.tamanho_subtt_3s) {
            el_subtt_3s.style.fontSize = dados.secao_3.tamanho_subtt_3s + 'pt';
        }
    }

    const el_txt_3s = document.getElementById('txt_3s');
    if (el_txt_3s && dados.secao_3.txt_3s) {
        el_txt_3s.innerText = dados.secao_3.txt_3s;
        if (dados.secao_3.tamanho_txt_3s) {
            el_txt_3s.style.fontSize = dados.secao_3.tamanho_txt_3s + 'pt';
        }
    }

    const el_subtt_3s_2 = document.getElementById('subtt_3s_2');
    if (el_subtt_3s_2 && dados.secao_3.subtt_3s_2) {
        el_subtt_3s_2.innerText = dados.secao_3.subtt_3s_2;
        if (dados.secao_3.tamanho_subtt_3s_2) {
            el_subtt_3s_2.style.fontSize = dados.secao_3.tamanho_subtt_3s_2 + 'pt';
        }
    }

    const el_txt_3s_2 = document.getElementById('txt_3s_2');
    if (el_txt_3s_2 && dados.secao_3.txt_3s_2) {
        el_txt_3s_2.innerText = dados.secao_3.txt_3s_2;
        if (dados.secao_3.tamanho_txt_3s_2) {
            el_txt_3s_2.style.fontSize = dados.secao_3.tamanho_txt_3s_2 + 'pt';
        }
    }

    const el_subtt_3s_3 = document.getElementById('subtt_3s_3');
    if (el_subtt_3s_3 && dados.secao_3.subtt_3s_3) {
        el_subtt_3s_3.innerText = dados.secao_3.subtt_3s_3;
        if (dados.secao_3.tamanho_subtt_3s_3) {
            el_subtt_3s_3.style.fontSize = dados.secao_3.tamanho_subtt_3s_3 + 'pt';
        }
    }

    const el_txt_3s_3 = document.getElementById('txt_3s_3');
    if (el_txt_3s_3 && dados.secao_3.txt_3s_3) {
        el_txt_3s_3.innerText = dados.secao_3.txt_3s_3;
        if (dados.secao_3.tamanho_txt_3s_3) {
            el_txt_3s_3.style.fontSize = dados.secao_3.tamanho_txt_3s_3 + 'pt';
        }
    }

    const el_img_3s = document.getElementById('img_3s');
    if (el_img_3s && dados.secao_3.img_3s) {
        el_img_3s.src = dados.secao_3.img_3s;
        if (dados.secao_3.alt_img_3s) {
            el_img_3s.alt = dados.secao_3.alt_img_3s;
        }
    }

    const el_legenda_trajetoria = document.getElementById('legenda_trajetoria');
    if (el_legenda_trajetoria && dados.secao_3.legenda_trajetoria) {
        el_legenda_trajetoria.innerText = dados.secao_3.legenda_trajetoria;
    }

    // Carregar trabalhos/portfólio
    carregarTrabalhos(dados);
}

/**
 * Carrega os trabalhos na página de portfólio
 */
function carregarTrabalhos(dados) {
    const gridTrabalhos = document.getElementById('grid-trabalhos');
    if (!gridTrabalhos) return; // Se não estiver na página de trabalhos, sair

    // Validar se existe a seção de trabalhos
    if (!dados.secao_trabalhos) {
        console.warn('Seção de trabalhos não encontrada no JSON');
        return;
    }

    // Limpar grid
    gridTrabalhos.innerHTML = '';

    // Carregar título e descrição da seção
    const titleEl = document.getElementById('titulo_trabalhos');
    const descEl = document.getElementById('descricao_trabalhos');

    if (titleEl && dados.secao_trabalhos.titulo_trabalhos) {
        titleEl.innerText = dados.secao_trabalhos.titulo_trabalhos;
        if (dados.secao_trabalhos.tamanho_titulo_trabalhos) {
            titleEl.style.fontSize = dados.secao_trabalhos.tamanho_titulo_trabalhos + 'pt';
        }
    }

    if (descEl && dados.secao_trabalhos.descricao_trabalhos) {
        descEl.innerText = dados.secao_trabalhos.descricao_trabalhos;
        if (dados.secao_trabalhos.tamanho_descricao_trabalhos) {
            descEl.style.fontSize = dados.secao_trabalhos.tamanho_descricao_trabalhos + 'pt';
        }
    }

    // Criar cards de trabalhos
    for (let i = 1; i <= 12; i++) {
        const trabalho = dados.secao_trabalhos[`trabalho_${i}`];
        if (trabalho && trabalho.titulo && trabalho.imagem) {
            const card = document.createElement('div');
            card.className = 'card-trabalho';
            card.setAttribute('data-categoria', trabalho.categoria.toLowerCase());

            // Escapar strings para o onclick
            const imgEscaped = trabalho.imagem.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const titleEscaped = trabalho.titulo.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const catEscaped = trabalho.categoria.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const descEscaped = trabalho.descricao.replace(/'/g, "\\'").replace(/"/g, '&quot;');

            card.innerHTML = `
                <img src="${trabalho.imagem}" alt="${trabalho.alt}" class="card-trabalho-imagem">
                <div class="card-trabalho-conteudo">
                    <div class="card-trabalho-categoria">${trabalho.categoria}</div>
                    <h3 class="card-trabalho-titulo">${trabalho.titulo}</h3>
                    <p class="card-trabalho-descricao">${trabalho.descricao}</p>
                    <button class="card-trabalho-botao" onclick="abrirModalTrabalho('${imgEscaped}', '${titleEscaped}', '${catEscaped}', '${descEscaped}')">Ver Detalhes</button>
                </div>
            `;

            gridTrabalhos.appendChild(card);
        }
    }

    // Adicionar filtros
    setupFiltros();
}

/**
 * Abre modal com detalhes do trabalho
 */
function abrirModalTrabalho(imagem, titulo, categoria, descricao) {
    const modal = document.getElementById('modal-trabalho');
    if (modal) {
        document.getElementById('img-modal-trabalho').src = imagem;
        document.getElementById('titulo-modal-trabalho').innerText = titulo;
        document.getElementById('categoria-modal-trabalho').innerText = categoria;
        document.getElementById('descricao-modal-trabalho').innerText = descricao;
        modal.style.display = 'block';
    }
}

/**
 * Setup dos filtros de categoria
 */
function setupFiltros() {
    const botoesFilto = document.querySelectorAll('.btn-filtro');
    const cardsTrabalho = document.querySelectorAll('.card-trabalho');

    botoesFilto.forEach(botao => {
        botao.addEventListener('click', () => {
            // Remove classe ativa de todos
            botoesFilto.forEach(b => b.classList.remove('ativo'));
            // Adiciona à clicado
            botao.classList.add('ativo');

            // Filtra cards
            const filtro = botao.getAttribute('data-filtro');
            cardsTrabalho.forEach(card => {
                if (filtro === 'todos' || card.getAttribute('data-categoria') === filtro.toLowerCase()) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Modal de trabalho
window.addEventListener('load', () => {
    const modalTrabalho = document.getElementById('modal-trabalho');
    const fecharModalTrabalho = document.getElementById('fechar-modal-trabalho');

    if (modalTrabalho && fecharModalTrabalho) {
        fecharModalTrabalho.onclick = () => {
            modalTrabalho.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modalTrabalho) {
                modalTrabalho.style.display = 'none';
            }
        };
    }
});

window.onload = () => {
    carregarConteudo();
};
