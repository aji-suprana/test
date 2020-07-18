const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('name').exists().not().isEmpty().isString(),
        body('delivery_fee').exists().not().isEmpty().isString(),
        body('delivery_time').exists().isNumeric().toInt(),
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid id'),
        body('name').optional().not().isEmpty().isString(),
        body('delivery_fee').optional().not().isEmpty().isString(),
        body('delivery_time').optional().isNumeric().toInt(),
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

const findAll = () => {
    return [
        param('start_price').optional().isNumeric().toFloat(),
        param('end_price').optional().isNumeric().toFloat(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
    ]
}

const findDeliveryFromSession = () => {
    return [
        param('session_id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
    findDeliveryFromSession
}