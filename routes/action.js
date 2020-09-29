/** Routes for actions */

const express = require('express');
const router = express.Router();
const { ensureCorrectUser, authReq } = require('../middleware/auth');
const Carbon = require('../models/carbon');

/** POST /[id]/  => {result} */

router.post('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await Carbon.addAction(data, id);
        return res.json({ result });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
