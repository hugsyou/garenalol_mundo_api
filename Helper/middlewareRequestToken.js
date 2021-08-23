const { isString } = require('lodash');

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports = function (req, res, next) {
    const { token } = req.query;
    if (!isString(token)) {
        res.status(400).json({ result: 'error', error: 'ERROR_BADREQUEST' }).end();
        return;
    }
    else if (token.length !== 64) {
        res.status(400).json({ result: 'error', error: 'ERROR_BADREQUEST_LENGTH' }).end();
        return;
    }
    else {
        next();
    }
}