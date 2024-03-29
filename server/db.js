const getUser = async function (db, username) {
  try {
    const user = await db.one(`
        SELECT * FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE username = $1
        );`, username).then((res) => res)
    return user
  } catch (e) {
    return `Error: ${e}`
  }
}

const getUserById = async function (db, userId) {
  try {
    const user = await db.one(`
        SELECT * FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE uid = $1
        );`, userId).then((res) => res)
    return user
  } catch (e) {
    return false
  }
}

const addUserById = async function (db, uid) {
  if (!uid) {
    return 'Error: empty Id'
  }
  try {
    try {
      const userIdExists = await db.none('SELECT * FROM users WHERE uid = $1;', uid)
    } catch {
      throw ('A user with this uid already exists')
    }
    return await db.one('INSERT INTO users (uid) VALUES ($1) RETURNING *;', uid)
      .then((res) => res)
  } catch (e) {
    return `Error: ${e}`
  }
}

const addUser = async function (db, username, email) {
  try {
    try {
      const userExists = await db.none('SELECT * FROM users WHERE username = $1;', username)
    } catch {
      throw ('A user with this username already exists')
    }
    try {
      const emailExists = await db.none('SELECT * FROM users WHERE email = $1;', email)
    } catch {
      throw ('A user with this email already exists')
    }
    return await db.one('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;', [username, email])
      .then((res) => res)
  } catch (e) {
    return `Error: ${e}`
  }
}

const addPattern = async function (db, uid, pattern) {
  try {
    const result = await db.any(`
            UPDATE users 
                SET patterns = COALESCE(patterns || $1, $1)
            WHERE id = (
                SELECT id FROM users 
                WHERE uid = $2
            );`, [pattern, uid])
      .then(async () => {
        const patterns = await getPatternsById(db, uid)
        const added = await db.one(`
                SELECT patterns FROM users 
                WHERE id = (
                    SELECT id FROM users 
                    WHERE uid = $1
                );`, uid)
          .then((results) => {
            if (results.patterns && !results.patterns.toString().includes(pattern.toString())) {
              throw (`Failed to add pattern ${pattern}`)
            } else {
              return `Added, current patterns: ${JSON.stringify(patterns)}`
            }
          })
        return added
      })
    return result
  } catch (e) { return `Error: ${e}` }
}

const deletePattern = async function (db, uid, patternId) {
  try {
    const exists = await db.one(`
            SELECT patterns ?| array[$2] FROM users
            WHERE id = (
                SELECT id FROM users
                WHERE uid = $1
            );`, [uid, patternId])
    if (!exists) {
      throw 'User does not have this pattern'
    } else {
      const deleted = await db.none(`
                UPDATE users
                    SET patterns = patterns - $1
                WHERE id = (
                    SELECT id FROM users
                    WHERE uid = $2
                );`, [patternId, uid])
        .then(async () => {
          const patterns = await getPatternsById(db, uid)
          const removed = await db.one(`
                    SELECT patterns FROM users 
                    WHERE id = (
                        SELECT id FROM users 
                        WHERE uid = $1
                    );`, uid)
            .then((results) => {
              if (results.patterns && !results.patterns.toString().includes(patternId.toString())) {
                return `Deleted, current patterns: ${JSON.stringify(patterns)}`
              }
              return `Failed to delete pattern ${patternId}`
            })
          return removed
        })
    }
  } catch (e) { return `Error: ${e}` }
}

const getPatternsById = async function (db, uid) {
  try {
    return await db.one(`
        SELECT patterns FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE uid = $1
        );`, uid)
      .then((res) => res)
  } catch (e) { return `Error: ${e}` }
}

module.exports = {
  getUser, getUserById, getPatternsById, addPattern, addUser, addUserById, deletePattern,
}
