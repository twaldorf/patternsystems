const {
  getUser, getUserById, getPatternsById, addPattern, addUser, addUserById, deletePattern,
} = require('../db.js')
const { db } = require('../config.js')

test('find nonexistent userId', () => {
  const userIdDNE = 'nonExistentUser'
  return getUserById(db, userIdDNE).then((data) => {
    expect(data).toBe(false)
  })
})

describe('create user', () => {
    test('create user by id', () => {
      const uid = 'testtesttest'
      return addUserById(db, uid).then((data) => {
        expect(data.uid).toBe(uid)
      })
    })

    test('fail to create user from null id', () => {
        return addUserById(null).then((data) => {
            expect(data).toBe('Error: empty Id')
        })
    }) 
})


afterAll(db.$pool.end)
