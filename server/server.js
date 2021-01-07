require('dotenv').config()

const express = require('Express')
const app = express()
const cors = require('cors')
const port = process.env.PORT

const { db } = require('./config.js')
const store = require('./repository.js')

app.use(cors())

const users = store.getUsers(db)
    .then(data => {return data})

app.get('/', (req, res) => {
    res.send(index)
})

// app.post('/users/', (req, res) => {
//     { req.json }
// })

app.listen(port, () => {
    console.log('Serving')
})