const { loginWithIdToken, getUserPatternsById, createUserFromId, addPatternToUser, getUserInfo } = require('./apiRoutes.js')
const { index, patterns, editor, login } = require('./viewRoutes.js')

const setup = (app) => {  
    app.route('/').get(index)
    app.route('/saves').get(patterns)
    app.route('/editor').get(editor)
    app.route('/login').get(login).post(loginWithIdToken)
    app.route('/login/new').post(createUserFromId)
    app.route('/users/:uid/patterns').get(getUserPatternsById).post(addPatternToUser)
    app.route('/users/:username').get(getUserInfo)
}

module.exports = { setup }
