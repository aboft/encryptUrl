const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knex = require('./dbConnection')
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


async function encrypt(text, key) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'utf8'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const keyHash = await bcrypt.hash(key, 12)
    await knex('urls').insert({ encrypted_url: encrypted.toString('hex'), encrypted_key: keyHash, iv: iv.toString('hex') })
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

module.exports = encrypt