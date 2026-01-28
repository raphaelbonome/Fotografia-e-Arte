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
        // Pega a largura da foto + 15px de margem (gap)
        return primeira_foto.clientWidth ; 
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
        // 1. Fazemos o pedido para o servidor
        const resposta = await fetch('/obter-conteudo');
        const dados = await resposta.json();

        // 2. Chamamos a função que vai aplicar os dados no HTML
        atualizarLayout(dados);
        
    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

function atualizarLayout(dados) {
    // 1. Cabeçalho e Logo 🏠
    const logo = document.querySelector('.logo');
    if (logo) logo.src = dados.secao_cabecalho.img_1s;

    // 2. Primeiro Carrossel (Topo) 🎡
    ['imgem1', 'imgem2', 'imgem3', 'imgem4', 'imgem5', 'imgem6'].forEach((id, idx) => {
        const el = document.getElementById(id);
        const key = `img_carrossel_${idx + 1}`;
        if (el && dados.carrossel_topo[key]) el.src = dados.carrossel_topo[key];
    });

    // 3. Segundo Carrossel (Trabalhos/Itens) 🛠️
    for (let i = 1; i <= 3; i++) {
        const item = document.getElementById(`item${i}`);
        if (item) {
            const img = item.querySelector('img');
            const txt = item.querySelector('p');
            const imgKey = `img_carrossel_${i}.2`;
            const txtKey = `texto-trabalho_${i}`;
            if (img && dados.trabalhos_carrossel_2[imgKey]) img.src = dados.trabalhos_carrossel_2[imgKey];
            if (txt && dados.trabalhos_carrossel_2[txtKey]) txt.innerText = dados.trabalhos_carrossel_2[txtKey];
        }
    }

    // 4. Seção Quem Somos (2ª Sessão) 
    const el_tt_2s = document.getElementById('tt_2s');
    if (el_tt_2s && dados.secao_2.titulo_2s) el_tt_2s.innerText = dados.secao_2.titulo_2s;
    
    const el_img_2s_1 = document.getElementById('img_2s-1');
    if (el_img_2s_1 && dados.secao_2.img_2s) el_img_2s_1.src = dados.secao_2.img_2s;
    
    const el_txt_2s_1 = document.getElementById('txt_2s-1');
    if (el_txt_2s_1 && dados.secao_2.texto_2s) el_txt_2s_1.innerText = dados.secao_2.texto_2s;
    
    const el_img_2s_2 = document.getElementById('img_2s-2');
    if (el_img_2s_2 && dados.secao_2['img_2s-2']) el_img_2s_2.src = dados.secao_2['img_2s-2'];
    
    const el_txt_2s_2 = document.getElementById('txt_2s-2');
    if (el_txt_2s_2 && dados.secao_2['texto_2s-2']) el_txt_2s_2.innerText = dados.secao_2['texto_2s-2'];

    // 5. Terceiro Carrossel (Sucesso/Festa) - Imagens e Legendas 🎆
    const el_titulo_carrossel = document.getElementById('titulo_carrossel');
    if (el_titulo_carrossel && dados.sucesso_carrossel_3.titulo_carrossel) {
        el_titulo_carrossel.innerText = dados.sucesso_carrossel_3.titulo_carrossel;
    }

    const imgsC = [
        { id: 'img_c1', img: 'img_carrossel_1.3', txt: 'texto-trabalho_1.3' },
        { id: 'img_c2', img: 'img_carrossel_2.3', txt: 'texto-trabalho_2.3' },
        { id: 'img_c3', img: 'img_carrossel_3.3', txt: 'texto-trabalho_3.3' },
        { id: 'img_c4', img: 'img_carrossel_4.3', txt: 'texto-trabalho_4.3' },
        { id: 'img_c5', img: 'img_carrossel_5.3', txt: 'texto-trabalho_5.3' },
        { id: 'img_c6', img: 'img_carrossel_6.3', txt: 'texto-trabalho_6.3' }
    ];

    imgsC.forEach(item => {
        const el = document.getElementById(item.id);
        if (el && dados.sucesso_carrossel_3[item.img] && dados.sucesso_carrossel_3[item.txt]) {
            el.src = dados.sucesso_carrossel_3[item.img];
            el.setAttribute('data-legenda', dados.sucesso_carrossel_3[item.txt]);
        }
    });
    console.log("Iniciando mapeamento de IDs...");

    const idsParaTestar = [
        'imgem1', 'tt_2s', 'img_2s-1', 'txt_2s-1', 
        'img_2s-2', 'txt_2s-2', 'titulo_carrossel', 
        'tt_3s', 'subtt_3s', 'txt_3s', 'img_3s'
    ];

    idsParaTestar.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.error(`❌ O ID '${id}' NÃO foi encontrado no HTML.`);
        } else {
            console.log(`✅ ID '${id}' encontrado com sucesso.`);
        }
    });

    // Se todos estiverem OK, o problema pode estar na estrutura do JSON.
    // 6. Nossa Trajetória (3ª Sessão) 📜
    const el_tt_3s = document.getElementById('tt_3s');
    if (el_tt_3s) el_tt_3s.innerText = dados.secao_3.titulo_3s;
    
    const el_subtt_3s = document.getElementById('subtt_3s');
    if (el_subtt_3s) el_subtt_3s.innerText = dados.secao_3.subtt_3s;
    
    const el_txt_3s = document.getElementById('txt_3s');
    if (el_txt_3s) el_txt_3s.innerText = dados.secao_3.txt_3s;
    
    const el_subtt_3s_2 = document.getElementById('subtt_3s_2 ');
    if (el_subtt_3s_2) el_subtt_3s_2.innerText = dados.secao_3.subtt_3s_2;
    
    const el_txt_3s_2 = document.getElementById('txt_3s.2');
    if (el_txt_3s_2) el_txt_3s_2.innerText = dados.secao_3.txt_3s_2;
    
    const el_subtt_3s_3 = document.getElementById('subtt_3s_3');
    if (el_subtt_3s_3) el_subtt_3s_3.innerText = dados.secao_3.subtt_3s_3;
    
    const el_txt_3s_3 = document.getElementById('txt_3s.3');
    if (el_txt_3s_3) el_txt_3s_3.innerText = dados.secao_3.txt_3s_3;
    
    const el_img_3s = document.getElementById('img_3s');
    if (el_img_3s) el_img_3s.src = dados.secao_3.img_3s;
}

window.onload = () => {
    // ...chame a função que busca os dados no servidor
    carregarConteudo(); 
};