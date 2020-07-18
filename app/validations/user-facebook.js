const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('first_name').exists().not().isEmpty().isString(),
        body('last_name').exists().not().isEmpty().isString(),
        body('email').exists().not().isEmpty().isEmail(),
        body('fb_id').exists().not().isEmpty().isString(),
        body('access_token').exists().not().isEmpty().isString()
    ]
}

module.exports = {
    save
}