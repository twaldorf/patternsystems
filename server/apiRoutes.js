require('dotenv').config()
const { db } = require('./config.js')
const { getUserById,addPattern,addUser,addUserById, getPatternsById } = require('./db.js')
const { verifyTokenForId } = require('./verify.js')

const loginWithIdToken = async (req, res) => {
    const verity = await verifyTokenForId(req.body.idToken).catch(console.error)
    if (verity) {
        const user = await getUserById(db, verity)
        if (!user) {
            const newUser = await addUserById(db, verity)
            res.status(200).send({response: newUser})
        } else {
            res.cookie('session', verity, {signed: true, maxAge: 60000000})
            res.status(200).send({response: user})
        }
    } else {
        res.status(401).send({response:'Invalid OAuth token'})
    }
}

const getUserPatternsById = async (req, res) => {
    console.log(`signed cookies: ${req.signedCookies}`)
    let  uid  = req.params.uid
    if (!uid) {
        res.status(401).send()
        return
    }
    let { patterns } = await getPatternsById(db, uid)
    console.log(patterns)
    if (!patterns) {
        res.status(200).send({response: 'User has no patterns'})
    } else {
        res.status(200).send(patterns)
    }
}

const getUserPatterns = async (req, res) => {
    let  uid  = req.signedCookies.session
    if (!uid) {
        res.status(401).send('Invalid session')
        return
    } 
    let { patterns } = await getPatternsById(db, uid)
    if (!patterns) {
        res.status(200).send({response: 'User has no patterns'})
    } else {
        res.status(200).send(patterns)
    }
}

const getUserInfo = async (req, res) => {
    let username  = req.params.username
    if (!username) {
        res.status(404).send('No username')
        return
    }
    let user = await getUser(db, req.params.username)
    res.status(200).send(user)
}

const addPatternToUser = async (req, res) => {
    const {session} = req.signedCookies
    if (session) {
        const pattern = JSON.stringify(req.body.pattern)
        console.log(`pattern: ${pattern}`)
        if (!pattern) {
            res.status(404).send('Missing uid or pattern')
        } else {
            let patterns = await addPattern(db, session, pattern)
            res.status(200).send({patterns})
        }
    } else {
        res.status(401).send({response:'Invalid session'})
    }
}

const addPatternToUserById = async (req, res) => {
    const {session} = req.signedCookies
    console.log(req.body)
    if (session) {
        const pattern = JSON.stringify(req.body.pattern)
        console.log(`pattern: ${pattern}`)
        if (!session || !pattern) {
            res.status(404).send('Missing uid or pattern')
        } else {
            let patternAdded = await addPattern(db, session, pattern)
            res.status(200).send({patternAdded})
        }
    } else {
        res.status(401).send({response:'Invalid session'})
    }
}

const createUserFromId = async (req,res) => {
    let { idToken } = req.body
    const uid = verifyTokenForId(idToken)
    if (!uid) {
        res.status(404).send('Invalid token')
        return
    }
    let user = await addUserById(db, uid)
    res.status(200).send(user)
}

module.exports = { loginWithIdToken, getUserPatternsById, getUserPatterns, addPatternToUser, addPatternToUserById, getUserInfo, createUserFromId }
