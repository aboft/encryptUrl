//configs
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
const encrypt = require('./utils/encrypt')
const decrypt = require('./utils/decrypt')
const knex = require('./utils/dbConnection')
const favicon = require('serve-favicon')
const path = require('path')
const port = process.env.PORT


//middleware
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

//test route
app.get('/', async (req, res) => {
    res.render('landing', {hashedUrl: false, errorMessage: false})
})


app.post('/encryptUrl', async (req, res) => {
    const url = req.body.encryptUrl
    const key = req.body.urlKey
    const encryptedUrl = await encrypt(url, key)
    console.log(encryptedUrl)
    res.render('landing', {hashedUrl: encryptedUrl, errorMessage: false})
})

app.get('/:hashId', async (req, res) => {
    const hashId = req.params.hashId
    const idExists = await knex('urls').select('encrypted_url').where({encrypted_url: hashId}).from('urls')
    if (idExists.length > 0) {
        res.render('decrypt', {encryptedUrl: hashId, errorMessage: false})
    } else {
        res.render('landing', {hashedUrl: false, errorMessage: "Unable to locate URL."} )
    }
    
})

app.post('/:hashId', async (req, res) => {
    const { hashedUrl, key } = req.body
    const decryptUrl = await decrypt(hashedUrl, key)
    if (decryptUrl) res.redirect(301, decryptUrl.startsWith('http') ? decryptUrl : 'http://'+decryptUrl)
    else { 
        res.render("decrypt", {encryptedUrl: hashedUrl, errorMessage: "Unable to decrypt URL."})
    }
})


//listening port
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
