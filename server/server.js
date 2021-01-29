const express = require('Express')

const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT

const app = express()

const { getUserPatterns, createUser, addPatternToUser, getUserInfo } = require('./routes.js')

app.use(helmet())
app.use(compression())

const origin = process.env.NODE_ENV === 'production' ? 'https://designpattern.systems' : '*'
console.log(origin)
app.use(cors(origin))

app.use(express.json())
app.use(express.static('public'))

app.route('/users/:username/patterns').get(getUserPatterns).post(addPatternToUser)
app.route('/users/:username').get(getUserInfo).post(createUser)

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})