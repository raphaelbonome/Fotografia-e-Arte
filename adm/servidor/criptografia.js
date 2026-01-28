const crypto = require('crypto');

// Chave secreta para criptografia
const CHAVE_SECRETA = 'chave_secreta_site_fotografia_2024';
const ALGORITMO = 'aes-256-cbc';

/**
 * Criptografa um texto
 * @param {string} texto - Texto a ser criptografado
 * @returns {string} Texto criptografado em formato hex
 */
function criptografar(texto) {
    const iv = crypto.randomBytes(16);
    const chave = crypto.createHash('sha256').update(CHAVE_SECRETA).digest();
    const cipher = crypto.createCipheriv(ALGORITMO, chave, iv);
    
    let criptografado = cipher.update(texto, 'utf8', 'hex');
    criptografado += cipher.final('hex');
    
    // Retorna IV + criptografado (separados por ':')
    return iv.toString('hex') + ':' + criptografado;
}

/**
 * Descriptografa um texto
 * @param {string} textoCriptografado - Texto criptografado
 * @returns {string} Texto descriptografado
 */
function descriptografar(textoCriptografado) {
    const partes = textoCriptografado.split(':');
    const iv = Buffer.from(partes[0], 'hex');
    const criptografado = partes[1];
    
    const chave = crypto.createHash('sha256').update(CHAVE_SECRETA).digest();
    const decipher = crypto.createDecipheriv(ALGORITMO, chave, iv);
    
    let descriptografado = decipher.update(criptografado, 'hex', 'utf8');
    descriptografado += decipher.final('utf8');
    
    return descriptografado;
}

module.exports = {
    criptografar,
    descriptografar,
    CHAVE_SECRETA
};
