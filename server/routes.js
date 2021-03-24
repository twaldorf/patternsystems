const apiRoutes = require('./apiRoutes')
const viewRoutes = require('./viewRoutes')

const { getUserPatterns, createUser, addPatternToUser, getUserInfo } = require('./apiRoutes.js')
const { index, patterns, editor } = require('./viewRoutes.js')

const setup = (app) => {  
    app.route('/').get(index)
    app.route('/saves').get(patterns)
    app.route('/editor').get(editor)
    app.route('/users/:username/patterns').get(getUserPatterns).post(addPatternToUser)
    app.route('/users/:username').get(getUserInfo).post(createUser)
}

module.exports = { setup }
