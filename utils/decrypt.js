const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knex = require('./dbConnection')
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);

async function decrypt(text, keyDec) {
    // const hashedKey = await bcrypt.hash(keyDec, 12)
    const getKeys = await knex('urls').select('iv', 'encrypted_key').where({
        encrypted_url: text,
    }).from('urls')
    const iv = Buffer.from(getKeys[0]["iv"], 'hex');
    const doMatch = await bcrypt.compare(keyDec, getKeys[0]["encrypted_key"])
    // console.log(hashedKey)
    if (doMatch) {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keyDec, 'utf8'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log(decrypted.toString())
        return decrypted.toString();
    }else {
        return false
    }
}

module.exports = decrypt