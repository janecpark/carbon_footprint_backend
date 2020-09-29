const bcrypt = require('bcrypt');
const db = require('../db');

const BCRYPT_WORK_FACTOR = 10;

/**
 * Related functions for users
 */

class User {
    /** authenticate user with username, password. Returns user or throws err. */
    static async authenticate(data) {
        const result = await db.query(
            `SELECT username, 
            password
            FROM users 
            WHERE username = $1`,
            [data.username]
        );

        const user = result.rows[0];
        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(data.password, user.password);
            if (isValid) {
                return user;
            }
        }
        const invalidPass = new Error('Invalid username/password');
        invalidPass.status = 401;
        throw invalidPass;
    }
    /** Register user with data. Returns new user data. */
    static async register(data) {
        const duplicateCheck = await db.query(
            `SELECT username 
            FROM users 
            WHERE username = $1`,
            [data.username]
        );

        if (duplicateCheck.rows[0]) {
            const err = new Error(
                `There already exists a user with username '${data.username}`
            );
            err.status = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            BCRYPT_WORK_FACTOR
        );

        const result = await db.query(
            `INSERT INTO users 
            (username, password, email) 
            VALUES ($1, $2, $3) 
            RETURNING username, password, email`,
            [data.username, hashedPassword, data.email]
        );

        return result.rows[0];
    }
    /** Given a username, return data about user. */
    static async findUser(username) {
        const userRes = await db.query(
            `SELECT username
                FROM users 
                WHERE username = $1`,
            [username]
        );
        const user = userRes.rows[0];
        if (!user) {
            const error = new Error(`There exists no user '${username}'`);
            error.status = 404;
            throw error;
        }

        return user;
    }
}

module.exports = User;
