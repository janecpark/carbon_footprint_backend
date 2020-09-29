const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/** Middleware to use when they must provide a valid token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

function authReq(req, res, next) {
    try {
        const tokenStr = req.body._token || req.query._token;
        let token = jwt.decode(tokenStr);
        req.username = token.username;
        return next();
    } catch (err) {
        let unauthorized = new Error('You must authenticate');
        unauthorized.status = 401;
        return next(unauthorized);
    }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

function ensureCorrectUser(req, res, next) {
    try {
        const tokenStr = req.body._token || req.query._token;
        let token = jwt.decode(tokenStr);
        req.username = token.username;

        if (token.username === req.params.username) {
            return next();
        }
        throw new Error();
    } catch (err) {
        const unauthorized = new Error('You are not authorized');
        unauthorized.status = 401;
        return next(unauthorized);
    }
}

module.exports = {
    authReq,
    ensureCorrectUser,
};
