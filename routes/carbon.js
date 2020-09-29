/** Routes for carbon footprint calculator. */

const express = require('express');
const router = express.Router();
const { ensureCorrectUser, authReq } = require('../middleware/auth');
const Carbon = require('../models/carbon');

/** GET / => {result: {result, ...} */

router.get('/calculate', async (req, res, next) => {
    try {
        const data = req.query;
        const result = await Carbon.getResult(data);
        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

/** POST/[username] => {result: {result, ...} */

router.post('/:username/result', ensureCorrectUser, async (req, res, next) => {
    try {
        const data = req.body;
        const username = req.params.username;
        const result = await Carbon.saveResult(data, username);
        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

/** GET/[username] => {result: {result, ...} */

router.get(
    '/:username/user-result',
    ensureCorrectUser,
    async (req, res, next) => {
        try {
            const username = req.params.username;
            const result = await Carbon.userResult(username);
            return res.json({ result });
        } catch (err) {
            return next(err);
        }
    }
);
/** DELETE /[id]  =>  [id]  */

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await Carbon.removeResult(id);
        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
