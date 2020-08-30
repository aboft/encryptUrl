//configs
const express = require('express');
const bodyParser = require('body-parser')
const knex = require('knex')
const crypto = require('crypto')
require('dotenv').config()
const app = express()
const port = process.env.PORT
//middleware
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended : true}))

//test route
app.get('/', async (req, res) => {
    res.render('landing')
})

app.post('/encryptUrl', async (req, res) => {
    const url = req.body.encryptUrl
    const key = req.body.urlKey
    res.send("Successfully received URL and key!")
})


//listening port
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})