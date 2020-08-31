//configs
const express = require('express');
const bodyParser = require('body-parser')
const knex = require('knex')
const crypto = require('crypto')
require('dotenv').config()
const app = express()
const port = process.env.PORT

const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//middleware
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))

//test route
app.get('/', async (req, res) => {
    res.render('landing')
})

function encrypt(text, key) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'utf8'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    console.log(encrypted)
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text, keyDec, ivDec) {
    let iv = Buffer.from(ivDec, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(keyDec, 'utf8'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

app.post('/encryptUrl', async (req, res) => {
    const url = req.body.encryptUrl
    const key = req.body.urlKey
    // const encryptedUrl = crypto.scryptSync(url, key, 64)
    // console.log(encryptedUrl.toString('hex'))
    // console.log(url, key)
    const encryptedUrl = await encrypt(url, key)
    console.log(encryptedUrl)
    res.send("Successfully received URL and key!")
})

app.get('/decryptUrl', async (req, res) => {
    res.render('decrypt')
})

app.post('/decryptUrl', async (req, res) => {
    const { text, key, iv } = req.body
    const decryptUrl = await decrypt(text, key, iv)
    res.send(decryptUrl)
})


//listening port
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})