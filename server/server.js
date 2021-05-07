const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const port = process.env.PORT

const express = require('express')
const app = express()

app.use(helmet())
app.use(compression())

app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    return next();
});

app.use(cookieParser(process.env.SECRET))

const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

const origin = process.env.NODE_ENV === 'production' ? ['https://designpattern.systems','https://apis.google.com/js/platform.js','873248529781-m38sr7u8k8lq20cndsr4ptiv6k1u6ojl.apps.googleusercontent.com'] : '*'
app.use(cors(origin))

app.use(express.json({type:"application/json"}))
app.use(express.static(path.join(__dirname, '../public')))

const glass = require('./glasscannon')
app.engine('glass', glass.cannon)
app.set('views', path.join(`${__dirname}/views`))
app.set('view engine', 'glass')

require('./routes').setup(app)

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})