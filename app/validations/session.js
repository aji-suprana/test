const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('session_name').exists().not().isEmpty().isString(),
        body('expired_at').exists().not().isEmpty().toDate(),
        body('description').optional().not().isEmpty(),
        body('cart_editable').optional().not().isEmpty().isBoolean()
    ]
}

const update = () => {
    return [
        body('session_name').optional().not().isEmpty().isString(),
        body('expired_at').optional().not().isEmpty().toDate(),
        body('description').optional().not().isEmpty(),
        body('is_expired').optional().not().isEmpty().isBoolean(),
        body('cart_editable').optional().not().isEmpty().isBoolean()
    ]
}

const destroy = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid session id')
    ]
}

const findById = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid session id')
    ]
}

const findByAll = () => {
    return [
        param('session_name').optional().isString(),
        param('description').optional(),
        param('is_expired').optional().toBoolean(),
        param('start_exp_date').optional().toDate(),
        param('end_exp_date').optional().toDate(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
    ]
}

const addProducts = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('products.*').exists().isUUID(4).withMessage('Please provide a valid product id'),
    ]
}

const removeProducts = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('products.*').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const addDeliveries = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('deliveries.*').exists().isUUID(4).withMessage('Please provide a valid delivery id'),
    ]
}

const removeDeliveries = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('deliveries.*').exists().isUUID(4).withMessage('Please provide a valid delivery id')
    ]
}

const addPayments = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('payments.*').exists().isUUID(4).withMessage('Please provide a valid payment option id'),
    ]
}

const removePayments = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid session id'),
        body('payments.*').exists().isUUID(4).withMessage('Please provide a valid payment option id')
    ]
}


module.exports = {
    save,
    update,
    destroy,
    findById,
    findByAll,
    addProducts,
    removeProducts,
    addDeliveries,
    removeDeliveries,
    addPayments,
    removePayments
}