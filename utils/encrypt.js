const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knex = require('./dbConnection')
const algorithm = 'aes-256-cbc';
const keySize = 32;

async function encrypt(text, password) {
    try {
        const salt = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(password, salt, keySize);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const storedUrl = encrypted.toString('base64').replace(/\//g,'_').replace(/\+/g, '-')
        const keyHash = await bcrypt.hash(password, 12);
        await knex('urls').insert({
            encrypted_url: storedUrl,
            encrypted_key: keyHash,
            iv: iv.toString('hex'),
            salt: salt.toString('hex')
        })
        console.log(encrypted)
        return { iv: iv.toString('hex'), encryptedData: storedUrl, key: password };
    } catch (e) {
        console.log(e)
        return `Unable to encrypt provided URL.`
    }
}

module.exports = encrypt