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

