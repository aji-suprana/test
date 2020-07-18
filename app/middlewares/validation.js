const { validationResult } = require('express-validator/check');
const debug =require('../services/debug');
const validate = (req, res, next) => {
    debug.logHeader("Validating request body");
    debug.logData('req.body',req.body)
    const errors = validationResult(req);

    if (errors.isEmpty())
    {
        debug.logData("next middleware", next);
        return next();
    } 
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        status: 'failed',
        message: 'incomplete arguments',
        errors: extractedErrors,
    });
}

module.exports = validate;