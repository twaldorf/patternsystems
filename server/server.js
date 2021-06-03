const app = require('./app.js')

require('dotenv').config()
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})