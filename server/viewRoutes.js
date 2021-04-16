const index = async (req, res) => {
    res.render('patterns', { title: 'DPS' })
}

const patterns = async (req, res) => {
    res.render('patterns', { title: 'DPS', message: 'Hello there!' })
}

const editor = async (req, res) => {
    // const { patternId } = req.params
    res.render('editor', {})
}

const login = async (req, res) => {
    res.render('login', {})
}

module.exports = { index, patterns, editor, login }
