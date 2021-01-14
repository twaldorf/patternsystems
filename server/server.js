const express = require('Express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT

const { getUserPatterns, createUser, addPatternToUser, getUserInfo } = require('./routes.js')

app.use(express.json())
app.use(cors())

app.route('/users/:username/patterns').get(getUserPatterns).post(addPatternToUser)
app.route('/users/:username').get(getUserInfo).post(createUser)

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})