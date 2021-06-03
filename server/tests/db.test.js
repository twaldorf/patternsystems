const { getUser,getUserById,getPatternsById,addPattern,addUser,addUserById,deletePattern } = require('../db.js')
const { db } = require('../config.js')

test('find nonexistent userId', () => {
    const userIdDNE = 'nonExistentUser'
    return getUserById(db, userIdDNE).then(data => {
        expect(data).toBe(false)
    })
})

test('create user', () => {
    const userIdDNE = 'nonExistentUser'
    return getUserById(db, userIdDNE).then(data => {
        expect(data).toBe(false)
    })
})

afterAll(db.$pool.end)