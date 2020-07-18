const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('first_name').exists().not().isEmpty().isString(),
        body('last_name').exists().not().isEmpty().isString(),
        body('email').exists().not().isEmpty().isEmail()
    ]
}

const update = () => {
    return [
        body('first_name').optional().isString(),
        body('last_name').optional().isString(),
        body('email').optional().isEmail()
    ]
}

const destroy = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const findById = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const findByAll = () => {
    return [
        param('first_name').optional().isString(),
        param('last_name').optional().isString(),
        param('email').optional().isString(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findByAll
}