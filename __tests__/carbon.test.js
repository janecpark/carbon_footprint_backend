const { TestScheduler } = require('jest');
const request = require('supertest');
const app = require('../app');

// const Carbon = require('../models/carbon');

const {
    TEST_DATA,
    afterEachHook,
    beforeEachHook,
    afterAllHook,
} = require('./config');

beforeEach(async function () {
    await beforeEachHook(TEST_DATA);
});

afterEach(async function () {
    await afterEachHook();
});

afterAll(async function () {
    await afterAllHook();
});

describe('POST /:username/result', async function () {
    test('Post carbon calculations', async function () {
        let dataObj = {
            food: 1.0,
            housing: 2.0,
            transport: 3.0,
            total: 6.0,
            _token: TEST_DATA.userToken,
        };
        const response = await request(app)
            .post('/carbon/test/result')
            .send(dataObj);
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toHaveProperty('total');
    });
    test('Responds with 401 if user is not authorized', async function () {
        let dataObj = {
            food: 1.0,
            housing: 2.0,
            transport: 3.0,
            total: 6.0,
            _token: TEST_DATA.userToken,
        };
        const response = await request(app)
            .post('/carbon/wrong-user/result')
            .send(dataObj);
        expect(response.statusCode).toBe(401);
    });
});

describe('DELETE /:id', async function () {
    test('Delete a result', async function () {
        const response = await request(app).delete(
            `/carbon/${TEST_DATA.currentResultId}`
        );
        expect(response.statusCode).toBe(200);
    });
    test('Responds with a 404 if it cannot find the result', async function () {
        const response = await request(app).delete('/carbon/1000');
        expect(response.statusCode).toBe(404);
    });
});

describe('GET /:username/user-result', async function () {
    test('Gets a list of user result', async function () {
        const response = await request(app)
            .get(`/carbon/${TEST_DATA.currentUsername}/user-result`)
            .send({
                _token: TEST_DATA.userToken,
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.result).toHaveLength(1);
    });
    test('Responds with 401 user is not authorized', async function () {
        const response = await request(app)
            .get('/carbon/wrong-user/user-result')
            .send({
                _token: TEST_DATA.userToken,
            });
        expect(response.statusCode).toBe(401);
    });
});
