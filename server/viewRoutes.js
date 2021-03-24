const index = async (req, res) => {
    res.render('index', { title: 'DPS' })
}

const patterns = async (req, res) => {
    res.render('patterns', { title: 'DPS', message: 'Hello there!' })
}

const editor = async (req, res) => {
    // const { patternId } = req.params
    res.render('editor', {})
}

module.exports = { index, patterns, editor }
