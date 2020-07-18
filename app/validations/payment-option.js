const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('name').exists().not().isEmpty().isString(),
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid id'),
        body('name').optional().not().isEmpty().isString(),
    ]
}

const destroy = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid payment id')
    ]
}

const findById = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid payment id')
    ]
}

const findAll = () => {
    return [
        // param('start_price').optional().isNumeric().toFloat(),
        // param('end_price').optional().isNumeric().toFloat(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
        // param('name').optional().not().isEmpty().isString(),
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
}