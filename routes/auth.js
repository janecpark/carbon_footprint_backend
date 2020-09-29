/** Routes for login. */

const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const createToken = require('../helpers/createToken');

/** POST / {userdata}  => {token: token} */

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
