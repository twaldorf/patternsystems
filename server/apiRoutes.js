require('dotenv').config()
const { db } = require('./config.js')
const {
  getUserById, addPattern, addUserById, getPatternsById, deletePattern,
} = require('./db.js')
const { verifyTokenForId } = require('./verify.js')

const loginWithIdToken = async (req, res) => {
  const verity = await verifyTokenForId(req.body.idToken).catch(console.error)
  if (verity) {
    const user = await getUserById(db, verity)
    console.log(user)
    if (!user) {
      const newUser = await addUserById(db, verity)
      res.status(200).send({ response: newUser })
    } else {
      res.cookie('session', verity, { signed: true, maxAge: 6 * 1000 * 1000 })
      res.status(200).send({ response: user })
    }
  } else {
    res.status(401).send({ response: 'Invalid OAuth token' })
  }
}

const getUserPatternsById = async (req, res) => {
  console.log(`signed cookies: ${req.signedCookies}`)
  const { uid } = req.params
  if (!uid) {
    res.status(401).send()
    return
  }
  const { patterns } = await getPatternsById(db, uid)
  console.log(patterns)
  if (!patterns) {
    res.status(404).send({ response: 'User has no patterns' })
  } else {
    res.status(200).send(patterns)
  }
}

const getUserPatterns = async (req, res) => {
  const uid = req.signedCookies.session
  if (!uid) {
    res.status(401).send('Invalid session')
    return
  }
  const { patterns } = await getPatternsById(db, uid)
  if (!patterns) {
    res.status(200).send({ response: 'User has no patterns' })
  } else {
    res.status(200).send(patterns)
  }
}

const getUserInfo = async (req, res) => {
  const { username } = req.params
  if (!username) {
    res.status(404).send('No username')
    return
  }
  const user = await getUser(db, req.params.username)
  res.status(200).send(user)
}

const getUserInfoById = async (req, res) => {
  const uid = req.signedCookies.session
  if (!uid) {
    res.status(401).send('Not logged in')
  } else {
    const user = await getUserById(db, uid)
    res.status(200).send(user)
  }
}

const addPatternToUserById = async (req, res) => {
  const { session } = req.signedCookies
  if (session) {
    let { pattern } = req.body
    pattern = validate(pattern)
    console.log(pattern)
    if (!session || !pattern) {
      res.status(200).send('Missing uid or pattern')
    } else {
      const patternAdded = await addPattern(db, session, pattern)
      res.status(200).send({ patternAdded })
    }
  } else {
    res.status(401).send({ response: 'Invalid session' })
  }
}

const createUserFromId = async (req, res) => {
  const { idToken } = req.body
  const uid = verifyTokenForId(idToken)
  if (!uid) {
    res.status(404).send('Invalid token')
    return
  }
  const user = await addUserById(db, uid)
  res.status(200).send(user)
}

const validate = (pattern) => {
  try {
    const barePattern = pattern[Object.keys(pattern)[0]]
    const { state } = barePattern
    const { points } = state.form
    if (!state || !points) {
      return false
    }
    return pattern
  } catch (e) {
    return false
  }
}

const deletePatternFromUserById = async (req, res) => {
  const { session } = req.signedCookies
  const { patternId } = req.body
  console.log(patternId)
  if (!session || !patternId) {
    res.status(200).send('Missing uid or pattern')
  } else {
    const patternDeleted = await deletePattern(db, session, patternId)
    res.status(200).send({ patternDeleted })
  }
}

const logout = async (req, res, next) => {
  const { session } = req.signedCookies
  res.clearCookie('session')
  next()
}

module.exports = {
  loginWithIdToken, getUserPatternsById, getUserPatterns, addPatternToUserById, getUserInfo, getUserInfoById, createUserFromId, deletePatternFromUserById, logout,
}
