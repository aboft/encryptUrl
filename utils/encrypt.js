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
        const keyHash = await bcrypt.hash(password, 12);
        await knex('urls').insert({
            encrypted_url: encrypted.toString('hex'),
            encrypted_key: keyHash,
            iv: iv.toString('hex'),
            salt: salt.toString('hex')
        })
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    } catch (e) {
        return `Unable to encrypt provided URL.`
    }
}

module.exports = encrypt