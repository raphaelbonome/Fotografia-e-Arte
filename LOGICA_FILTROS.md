# 📚 Explicação da Lógica de Filtros - Página de Trabalhos

## 🎯 Como Funciona o Sistema de Filtros

### **1. Estrutura de Dados (JSON)**

Cada trabalho tem 5 propriedades principais:
```json
{
  "trabalho_1": {
    "titulo": "Casamento em Praia",
    "descricao": "Uma cerimônia emocionante...",
    "categoria": "Casamentos",        // ← CHAVE DO FILTRO
    "imagem": "https://images.unsplash.com/...",
    "alt": "Cerimônia de casamento na praia"
  }
}
```

### **2. Fluxo de Carregamento**

**A. Ao carregar a página trabalhos.html:**

```javascript
1. carregarConteudo() 
   └─ Faz fetch para /obter-conteudo
   
2. atualizarLayout(dados)
   └─ Valida e carrega todas seções
   
3. carregarTrabalhos(dados) ← FUNÇÃO PRINCIPAL
   └─ Verifica se existe elemento #grid-trabalhos
   └─ Se não existir (ex: na página index.html), sai da função
   └─ Se existir, cria todos os 12 cards
   
4. setupFiltros() ← ATIVA OS FILTROS
   └─ Adiciona event listeners aos botões
```

### **3. Criação dos Cards**

Cada card é criado dinamicamente com:

```html
<div class="card-trabalho" data-categoria="casamentos">
  ├─ <img src="..." class="card-trabalho-imagem">
  └─ <div class="card-trabalho-conteudo">
      ├─ <div class="card-trabalho-categoria">Casamentos</div>
      ├─ <h3 class="card-trabalho-titulo">Casamento em Praia</h3>
      ├─ <p class="card-trabalho-descricao">Uma cerimônia...</p>
      └─ <button onclick="abrirModalTrabalho(...)">Ver Detalhes</button>
```

### **4. Atributo data-categoria**

- **Propósito:** Identificar a categoria do card para filtros
- **Onde vem:** De `trabalho.categoria.toLowerCase()`
- **Exemplo:** 
  - categoria: "Casamentos" → data-categoria="casamentos"
  - categoria: "Eventos" → data-categoria="eventos"

### **5. Lógica de Filtros (setupFiltros)**

```javascript
function setupFiltros() {
  // 1. Seleciona todos os botões de filtro
  const botoesFilto = document.querySelectorAll('.btn-filtro');
  
  // 2. Seleciona todos os cards de trabalho
  const cardsTrabalho = document.querySelectorAll('.card-trabalho');

  // 3. Para cada botão, adiciona listener de clique
  botoesFilto.forEach(botao => {
    botao.addEventListener('click', () => {
      
      // 3a. Remove classe "ativo" de todos os botões
      botoesFilto.forEach(b => b.classList.remove('ativo'));
      
      // 3b. Adiciona classe "ativo" ao botão clicado (muda cor)
      botao.classList.add('ativo');

      // 3c. Obtém o filtro do atributo data-filtro
      const filtro = botao.getAttribute('data-filtro');
      
      // 3d. Para cada card, verifica se deve mostrar ou esconder
      cardsTrabalho.forEach(card => {
        if (filtro === 'todos' || 
            card.getAttribute('data-categoria') === filtro.toLowerCase()) {
          card.style.display = 'block';  // Mostra
        } else {
          card.style.display = 'none';   // Esconde
        }
      });
    });
  });
}
```

### **6. Exemplo Prático**

**Clique em "Casamentos":**

1. Botão clicado tem `data-filtro="casamentos"`
2. Extrai: `filtro = "casamentos"`
3. Para cada card:
   - Se `card.data-categoria === "casamentos"` → Mostra ✓
   - Se `card.data-categoria === "eventos"` → Esconde ✗
   - Se `card.data-categoria === "ensaios"` → Esconde ✗
   - Se `card.data-categoria === "comercial"` → Esconde ✗

**Resultado:** Apenas 3 cards aparecem (trabalhos 1, 5, 9)

---

## 🖼️ Por que as Imagens Aparecem?

### **Antes (Não funcionava):**
```javascript
card.innerHTML = `
  <img src="${trabalho.imagem}">
  ...
  <button onclick="...">Ver</button>
`;
```
❌ Problema: Caracteres especiais nas URLs quebravam o onclick

### **Depois (Funciona corretamente):**
```javascript
const imgEscaped = trabalho.imagem.replace(/'/g, "\\'").replace(/"/g, '&quot;');
const titleEscaped = trabalho.titulo.replace(/'/g, "\\'");
const catEscaped = trabalho.categoria.replace(/'/g, "\\'");
const descEscaped = trabalho.descricao.replace(/'/g, "\\'");

card.innerHTML = `
  <img src="${trabalho.imagem}">
  ...
  <button onclick="abrirModalTrabalho('${imgEscaped}', '${titleEscaped}', ...)">Ver</button>
`;
```

✅ **Escape Characters:**
- `'` (aspas simples) → `\'` (escapada)
- `"` (aspas duplas) → `&quot;` (entity HTML)
- URLs com caracteres especiais não quebram o onclick

---

## 🏷️ Categorias Disponíveis

| data-filtro | Nomes na Categoria |
|---|---|
| `casamentos` | "Casamentos" |
| `eventos` | "Eventos" |
| `ensaios` | "Ensaios" |
| `comercial` | "Comercial" |

---

## 📱 CSS dos Filtros

```css
.btn-filtro {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Estado inativo */
.btn-filtro:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Estado ativo (ao clicar) */
.btn-filtro.ativo {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}
```

---

## 🔍 Como Debugar se Não Funcionar

Abra o Console do Navegador (F12):

```javascript
// Ver se os dados foram carregados
console.log(window.gridTrabalhos);

// Ver todos os cards criados
console.log(document.querySelectorAll('.card-trabalho'));

// Ver quantos cards de cada categoria
console.log(
  [...document.querySelectorAll('.card-trabalho')]
  .map(c => c.getAttribute('data-categoria'))
);

// Testar filtro manualmente
document.querySelectorAll('.card-trabalho').forEach(card => {
  card.style.display = 
    card.getAttribute('data-categoria') === 'casamentos' ? 'block' : 'none';
});
```

---

## 📊 Resumo da Lógica

```
┌─ HTML (trabalhos.html)
│  ├─ Botões de filtro: data-filtro="..."
│  └─ Grid: id="grid-trabalhos"
│
├─ JSON (dados_do_site.json)
│  └─ Cada trabalho tem: categoria, titulo, descricao, imagem
│
├─ JavaScript (logica.js)
│  ├─ carregarTrabalhos(): Cria cards dinamicamente
│  │  └─ Atribui data-categoria baseado na categoria do JSON
│  │
│  └─ setupFiltros(): Ativa os filtros
│     └─ Compara data-filtro do botão com data-categoria do card
│
└─ CSS (trabalhos.css)
   └─ .btn-filtro.ativo: Estilo visual do botão ativo
```

---

## ✅ Tudo Funcionando Agora!

- ✓ Imagens carregam do JSON (URLs do Unsplash)
- ✓ Cards criam-se dinamicamente
- ✓ Filtros funcionam sem quebrar
- ✓ Modal abre com detalhes do trabalho
- ✓ Responsive para mobile
