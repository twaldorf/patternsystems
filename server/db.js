const getUser = async function (db, username) {
    try {
        let user = await db.one(`
        SELECT * FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE username = $1
        );`, username).then(res => {
            return res
        })
        return user
    } 
    catch(e) {
        return `Error: ${e}`
    }
}

const getUserById = async function (db, userId) {
    try {
        let user = await db.one(`
        SELECT * FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE uid = $1
        );`, userId).then(res => {
            return res
        })
        return user
    } 
    catch(e) {
        return false
    }
}

const addUserById = async function (db, uid) {
    console.log(uid)
    if (!uid) {
        return `Error: empty Id`
    }
    try {
        try {
            const userIdExists = await db.none(`SELECT * FROM users WHERE uid = $1;`, uid)
        } catch {
            throw('A user with this uid already exists')
        }
        return await db.one(`INSERT INTO users (uid) VALUES ($1) RETURNING *;`, uid)
            .then(res => {
                return res
            })
    } catch (e) {
        return `Error: ${e}`
    }
}

const addUser = async function (db, username, email) {
    try {
        try {
            const userExists = await db.none(`SELECT * FROM users WHERE username = $1;`, username)
        } catch {
            throw('A user with this username already exists')
        }
        try {
            const emailExists = await db.none(`SELECT * FROM users WHERE email = $1;`, email)
        } catch {
            throw('A user with this email already exists')
        }
        return await db.one(`INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;`, [username, email])
            .then(res => {
                return res
            })
    } catch (e) {
        return `Error: ${e}`
    }
}

const addPattern = async function (db, uid, pattern) {
    try {
        const exists = await db.one(`
        SELECT patterns FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE uid = $1
        );`, uid)
        .then((results) => {
            if (results.patterns && results.patterns.includes(pattern)) {
                throw(`User ${uid} already has this pattern`)
            }
        })
        const result = await db.none(`
            UPDATE users 
                SET patterns = array_append(patterns, $1) 
            WHERE id = (
                SELECT id FROM users 
                WHERE uid = $2
            );`, [pattern,uid])
            .then(() => {
                return 'Pattern added'
            })
        return result
    } catch(e) {return `Error: ${e}`}
}

const getPatternsById = async function (db, uid) {
    try {
        return await db.one(`
        SELECT patterns FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE uid = $1
        );`, uid)
        .then((res) => {
            return res
        })
    } catch (e) {return `Error: ${e}`}
}

module.exports = { getUser,getUserById,getPatternsById,addPattern,addUser,addUserById }
