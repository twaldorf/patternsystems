const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const port = process.env.PORT

const express = require('Express')
const app = express()

app.use(helmet())
app.use(compression())

const origin = process.env.NODE_ENV === 'production' ? 'https://designpattern.systems' : '*'
app.use(cors(origin))

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

const glass = require('./glasscannon')
app.engine('glass', glass.cannon)
app.set('views', path.join(`${__dirname}/views`))
app.set('view engine', 'glass')

require('./routes').setup(app)

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})