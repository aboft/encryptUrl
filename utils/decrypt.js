const crypto = require('crypto')
const bcrypt = require('bcrypt')
const knex = require('./dbConnection')
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);

async function decrypt(text, password) {
    // const hashedKey = await bcrypt.hash(keyDec, 12)
    const getKeys = await knex('urls').select('iv', 'encrypted_key', 'salt').where({
        encrypted_url: text,
    }).from('urls')
    try {
        const doMatch = await bcrypt.compare(password, getKeys[0]["encrypted_key"])
        // console.log(hashedKey)
        if (doMatch) {
            const iv = Buffer.from(getKeys[0]["iv"], 'hex');
            const salt = Buffer.from(getKeys[0]["salt"], 'hex')
            const key = crypto.scryptSync(password, salt, 32)
            const encryptedText = Buffer.from(text, 'hex');
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            console.log(decrypted.toString())
            return decrypted.toString();
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

module.exports = decrypt