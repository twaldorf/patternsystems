const comps = require('./comps.js')

const index = async (req, res) => {
    res.render('patterns', { 
        ...comps
    })
}

const patterns = async (req, res) => {
    res.render('patterns', {
        ...comps,
    })
}

const editor = async (req, res) => {
    res.render('editor', {
        ...comps
    })
}

const login = async (req, res) => {
    res.render('login', {
        ...comps
    })
}

module.exports = { index, patterns, editor, login }
