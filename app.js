//configs
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const encrypt = require('./utils/encrypt')
const decrypt = require('./utils/decrypt')
const port = process.env.PORT


//middleware
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))

//test route
app.get('/', async (req, res) => {
    res.render('landing', {hashedUrl: null})
})


app.post('/encryptUrl', async (req, res) => {
    const url = req.body.encryptUrl
    const key = req.body.urlKey
    const encryptedUrl = await encrypt(url, key)
    console.log(encryptedUrl)
    res.render('landing', {hashedUrl: encryptedUrl})
})

app.get('/:hashId', async (req, res) => {
    res.render('decrypt', {encryptedUrl: req.params.hashId})
})

app.post('/decryptUrl', async (req, res) => {
    const { text, key } = req.body
    const decryptUrl = await decrypt(text, key)
    if (decryptUrl) res.redirect(301, decryptUrl.startsWith('http') ? decryptUrl : 'http://'+decryptUrl)
    else res.send("Unable to decrypt.")
})


//listening port
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})