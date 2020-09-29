/** Routes for users. */

const express = require('express');
const router = express.Router();
const { ensureCorrectUser, authReq } = require('../middleware/auth');
const User = require('../models/user');
const createToken = require('../helpers/createToken');

/** GET /[username] => {user: user} */

router.get('/:username', async function (req, res, next) {
    try {
        const user = await User.findUser(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** POST / {userdata}  => {token: token} */

router.post('/', async (req, res, next) => {
    try {
        delete req.body._token;
        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
