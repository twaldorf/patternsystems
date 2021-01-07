const getUsers = async function (db) {
    try {
        return await db.any('SELECT * FROM users', [true])
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
        return await db.one(`INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;`, username, email)
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
            if (results.patterns.includes(patternName)) {
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
        db.done()
        return result
    } catch(e) {return `Error: ${e}`}
}

module.exports = {getUsers,addPattern,addUser}

// const { Sequelize } = require("sequelize/types");

// const initSequelize = () => {
//     User.init(
//         {
//             id: {
//                 type: Sequelize.INTEGER,
//                 allowNull: false,
//                 primaryKey: true,
//                 autoIncrement: true
//             },
//             uuid: {
//                 type: Sequelize.STRING,
//                 allowNull: false,
//             },
//             username: {
//                 type: Sequelize.STRING,
//                 allowNull: false,
//             },
//             email: {
//                 type: Sequelize.STRING,
//                 allowNull: false,
//             },
//             patterns: {
//                 type: Sequelize.ARRAY(Sequelize.STRING),
//                 allowNull: true,
//             },
//             prefs: {
//                 type: Sequelize.ARRAY(Sequelize.BOOLEAN),
//                 allowNull: true,
//             }
//         },
//         {
//             sequelize,
//             tableName: 'Users'
//         }
//     )

//     var sequelize = new Sequelize(config.database, config.user, config.password, {
//         host: config.server,
//         dialect: 'postgres',
//         define: {
//           freezeTableName: true,
//           timestamps: false
//         }
//     })
// }

// class User extends Sequelize.Model {}

// const repository = function(config) {
//     var sequelize = initSequelize(config)

//     const disconnect = () => {
//         sequelize.close()
//     }

//     const createUser = (uuid,username,email,patterns,prefs) => {
//         return User.create({
//             uuid: uuid,
//             username: username,
//             email: email,
//             patterns: patterns,
//             prefs: prefs
//         })
//     }

//     const deleteUser = (uuid) => {
//         return User.delete({
//             uuid: uuid
//         })
//     }

//     const getUser = (uuid) => {
//         // return User
//     }

//     Object.create({
//         disconnect,
//         createUser,
//         deleteUser
//     })
// }