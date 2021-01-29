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

const addPattern = async function (db, username, patternName) {
    try {
        const exists = await db.one(`
        SELECT patterns FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE username = $1
        );`, username)
        .then((results) => {
            if (results.patterns && results.patterns.includes(patternName)) {
                throw(`User ${username} already has this pattern`)
            }
        })
        const result = await db.none(`
            UPDATE users 
                SET patterns = array_append(patterns, $1) 
            WHERE id = (
                SELECT id FROM users 
                WHERE username = $2
            );`, [patternName,username])
            .then(() => {
                return 'Pattern added'
            })
        return result
    } catch(e) {return `Error: ${e}`}
}

const getPatterns = async function (db, username) {
    try {
        return await db.one(`
        SELECT patterns FROM users 
        WHERE id = (
            SELECT id FROM users 
            WHERE username = $1
        );`, username)
        .then((res) => {
            return res
        })
    } catch (e) {return `Error: ${e}`}
}

module.exports = { getUser,getPatterns,addPattern,addUser }
