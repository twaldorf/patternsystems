const express = require('express')
const app = express()

const helmet = require('helmet')
app.use(helmet())

const compression = require('compression')
app.use(compression())

const cors = require('cors')
const origin = process.env.NODE_ENV === 'production' ? ['https://designpattern.systems','https://apis.google.com/js/platform.js','873248529781-m38sr7u8k8lq20cndsr4ptiv6k1u6ojl.apps.googleusercontent.com'] : '*'
app.use(cors(origin))

const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
})
app.use(limiter)


require('dotenv').config()
const cookieParser = require('cookie-parser')
app.use(cookieParser(process.env.SECRET))

const path = require('path')
app.use(express.json({type:"application/json"}))
app.use(express.static(path.join(__dirname, '../public')))

const glass = require('./glasscannon')
app.engine('glass', glass.cannon)
app.set('views', path.join(`${__dirname}/views`))
app.set('view engine', 'glass')

require('./routes').setup(app)

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    return next();
});

module.exports = app