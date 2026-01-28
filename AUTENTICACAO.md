# Sistema de Autenticação e Criptografia 🔐

## Descrição
Sistema básico de login com criptografia AES-256 para proteger as credenciais administrativas.

## Arquivos Criados

### 1. **criptografia.js**
- Módulo com funções de criptografia/descriptografia
- Usa algoritmo AES-256-CBC (padrão militar)
- Chave secreta: `chave_secreta_site_fotografia_2024`
- Funções exportadas:
  - `criptografar(texto)` - Criptografa um texto
  - `descriptografar(textoCriptografado)` - Descriptografa um texto

### 2. **credenciais.json**
- Arquivo com as credenciais administrativas criptografadas
- Formato: `{ "login": "...", "senha": "..." }`
- Localização: `/adm/servidor/credenciais.json`
- **Credenciais padrão:**
  - Login: `admin`
  - Senha: `admin`

### 3. **gerar_credenciais.js**
- Script para gerar/regenerar o arquivo de credenciais criptografadas
- Uso: `node gerar_credenciais.js`
- Útil para alterar credenciais depois

### 4. **logica_login.js**
- Lógica JavaScript do cliente para validação de login
- Valida credenciais no servidor via POST
- Armazena token no `localStorage`
- Redireciona para `painel.html` se autenticado
- Verifica se o usuário está autenticado ao acessar páginas protegidas

### 5. **login.html** (Atualizado)
- Página de login melhorada
- Campos: Login e Senha
- Exibe mensagens de erro/sucesso
- Link para script `logica_login.js`

### 6. **estilo_login.css** (Novo)
- Estilos modernos com gradiente
- Design responsivo
- Animações suaves
- Mensagens de feedback coloridas

### 7. **servidor.js** (Atualizado)
- Novo endpoint POST `/validar-login`
- Recebe `{ login, senha }`
- Retorna `{ sucesso: boolean, mensagem: string }`
- Valida credenciais descriptografadas

## Fluxo de Autenticação

```
1. Usuário acessa /login.html
   ↓
2. Preenche login e senha
   ↓
3. JavaScript envia para POST /validar-login
   ↓
4. Servidor descriptografa credenciais e valida
   ↓
5. Se correto:
   - Salva token no localStorage
   - Redireciona para /painel.html
   ↓
6. Se incorreto:
   - Exibe mensagem de erro
```

## Como Alterar Credenciais

1. Edite `gerar_credenciais.js`:
```javascript
const credenciais = {
    login: 'novo_login',
    senha: 'nova_senha'
};
```

2. Execute:
```bash
node gerar_credenciais.js
```

3. Arquivo `credenciais.json` será regenerado com as novas credenciais criptografadas

## Segurança

⚠️ **Notas importantes:**
- As credenciais padrão (`admin/admin`) devem ser alteradas quando o projeto for finalizado
- A chave secreta está hardcoded (melhorar em produção)
- Use HTTPS em produção
- Implemente refresh tokens
- Adicione proteção contra força bruta
- Hash de senha (bcrypt) seria ideal para produção

## Endpoints

### POST /validar-login
```javascript
// Request
{
  "login": "admin",
  "senha": "admin"
}

// Response (sucesso)
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso! ✅",
  "token": "autenticado"
}

// Response (erro)
{
  "sucesso": false,
  "mensagem": "Login ou senha incorretos! ❌"
}
```

## Próximas Melhorias

- [ ] Adicionar proteção contra força bruta
- [ ] Implementar sessões com timeout
- [ ] Usar hash bcrypt para senhas
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Migrar chave secreta para variáveis de ambiente
- [ ] Implementar refresh tokens
- [ ] Adicionar logs de tentativas de login
