const request = require('supertest')
const app = require('../app')

const User = require('../models/user')

const {
    TEST_DATA,
    afterEachHook,
    beforeEachHook,
    afterAllHook
  } = require("./config");

  beforeEach(async function () {
    await beforeEachHook(TEST_DATA);
  });
  
  
  afterEach(async function () {
    await afterEachHook();
  });
  
  
  afterAll(async function () {
    await afterAllHook();
  });
  
  describe("POST /users", async function () {
    test("Creates a new user", async function () {
      let dataObj = {
        username: "test123",
        password: "password",
        email: "test@test.com",
      };
      const response = await request(app)
          .post("/users")
          .send(dataObj);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
      const testInDb = await User.findUser("test123");
        expect('test123').toEqual(testInDb.username);
    });
  
    test("Prevents creating a user with duplicate username", async function () {
      const response = await request(app)
          .post("/users")
          .send({
            username: "test",
            password: "foo123",
            email: "test@test.com",
          });
      expect(response.statusCode).toBe(409);
    });
});
  
  describe("GET /users/:username", async function () {
    test("Gets a single a user", async function () {
      const response = await request(app)
          .get(`/users/${TEST_DATA.currentUsername}`)
          .send({_token: `${TEST_DATA.userToken}`});
      expect(response.body.user).toHaveProperty("username");
      expect(response.body.user).not.toHaveProperty("password");
      expect(response.body.user.username).toBe("test");
    });
  
    test("Responds with a 404 if it cannot find the user in question", async function () {
      const response = await request(app)
          .get(`/users/yaaasss`)
          .send({_token: `${TEST_DATA.userToken}`});
      expect(response.statusCode).toBe(404);
    });
  });
  


  
