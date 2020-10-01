process.env.NODE_ENV = 'test';
// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// app imports
const app = require('../app');
const db = require('../db');

const TEST_DATA = {};

async function beforeEachHook(TEST_DATA) {
    try {
        const hashedPassword = await bcrypt.hash('secret', 1);
        await db.query(
            `INSERT INTO users (username, password, email)
                    VALUES ('test', $1, 'test@test.com')`,
            [hashedPassword]
        );

        const response = await request(app).post('/login').send({
            username: 'test',
            password: 'secret',
        });

        TEST_DATA.userToken = response.body.token;
        TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;

        const res = await db.query(`SELECT id FROM users WHERE username=$1`, [
            TEST_DATA.currentUsername,
        ]);


        TEST_DATA.userId = res.rows[0].id
        const result = await db.query(
            'INSERT INTO results (user_id, food, housing, transport, total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [TEST_DATA.userId, 1.0, 2.0, 3.0, 6.0]
        );

        TEST_DATA.currentResultId = result.rows[0].id;

        const newAction = await db.query(
            'INSERT INTO takeaction (results_id, public_transport, carpool, low_carbon_diet, organic, fridge, green_electricity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [TEST_DATA.currentResultId, 1, 2, 3, 4, 5, 6]
        );
        TEST_DATA.ActionId = newAction.rows[0].id;
    } catch (error) {
        console.error(error);
    }
}

async function afterEachHook() {
    try {
        await db.query('DELETE FROM results');
        await db.query('DELETE FROM users');
        await db.query('DELETE FROM takeaction');
    } catch (error) {
        console.error(error);
    }
}

async function afterAllHook() {
    try {
        await db.end();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    afterAllHook,
    afterEachHook,
    TEST_DATA,
    beforeEachHook,
};
