const { loginWithIdToken, getUserPatternsById, getUserPatterns, createUserFromId, addPatternToUserById, getUserInfo, getUserInfoById } = require('./apiRoutes.js')
const { index, patterns, editor, login } = require('./viewRoutes.js')

const setup = (app) => {  
    app.route('/').get(index)
    app.route('/saves').get(patterns)
    app.route('/editor').get(editor)
    app.route('/login').get(login).post(loginWithIdToken)
    app.route('/login/new').post(createUserFromId)
    app.route('/users/me').get(getUserInfoById)
    app.route('/users/me/patterns').get(getUserPatterns).post(addPatternToUserById)
    app.route('/users/:uid/patterns').get(getUserPatternsById).post(addPatternToUserById)
    app.route('/users/:username').get(getUserInfo)
}

module.exports = { setup }
