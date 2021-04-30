const comps = require('./comps.js')

const index = async (req, res) => {
    res.render('patterns', { 
        header: comps.header
    })
}

const patterns = async (req, res) => {
    res.render('patterns', { 
        header: comps.header,
        title: 'DPS', message: 'Hello there!' 
    })
}

const editor = async (req, res) => {
    res.render('editor', {
        header: comps.header,
        btnLogin: comps.btnLogin,
        banner: comps.banner,
    })
}

const login = async (req, res) => {
    res.render('login', {
        header: comps.header,
    })
}

module.exports = { index, patterns, editor, login }
