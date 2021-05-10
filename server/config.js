require('dotenv').config()

const pgp = require('pg-promise')()


let connection

if (process.env.NODE_ENV == 'production') {
    pgp.pg.defaults.ssl = true
    connection = {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        max: 15,
        ssl: {rejectUnauthorized: false,},
    }
} else {
    connection = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 30
    }
}

const db = pgp(connection)
console.log(db)

module.exports = {db}