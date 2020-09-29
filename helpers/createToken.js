const { response } = require('express');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/** return signed JWT from user data. */

function createToken(user) {
    let payload = {
        username: user.username,
    };
    let token = jwt.sign(payload, SECRET)
    return token;
}

module.exports = createToken;
