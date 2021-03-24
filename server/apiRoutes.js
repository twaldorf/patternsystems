require('dotenv').config()
const { db } = require('./config.js')
const { getUser,getPatterns,addPattern,addUser } = require('./db.js')

const patternMaker = async (req, res) => {
    const { patternName } = req.params
    const patternObject = await getPattern(patternName)
    html = glass.pour('editor')
    res.render('editor', { user, pattern }, (err, html) => {
        res.send(html)
    })
}

const getUserPatterns = async (req, res) => {
    let  username  = req.params.username
    if (!username) {
        res.status(404).send('No username')
    }
    let { patterns } = await getPatterns(db, username)
    res.status(200).send(patterns)
}

const getUserInfo = async (req, res) => {
    let username  = req.params.username
    if (!username) {
        res.status(404).send('No username')
    }
    let user = await getUser(db, req.params.username)
    res.status(200).send(user)
}

const addPatternToUser = async (req, res) => {
    let username = req.params.username
    let pattern = req.body.pattern
    if (!username || !pattern) {
        res.status(404).send('No username')
    }
    let patterns = await addPattern(db, username, pattern)
    console.log(patterns)
    res.status(200).send(patterns)
}

const createUser = async (req,res) => {
    let { username, email } = req.body
    console.log(username, email)
    if (!username) {
        res.status(404).send('No username')
    }
    let user = await addUser(db, username, email)
    console.log(user)
    res.status(200).send(user)
}

module.exports = { getUserPatterns, addPatternToUser, getUserInfo, createUser }
