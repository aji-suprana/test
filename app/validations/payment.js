const { body, param } = require('express-validator/check');

const save = () => {
    return [
        body('merchant_id').exists().not().isEmpty().isString(),
        body('order_id').exists().not().isEmpty().isString(),
        body('invoice_no').exists().not().isEmpty().isString(),
        body('currency').exists().not().isEmpty().isString(),
        body('amount').exists().not().isEmpty().toFloat(),
        body('request_timestamp').exists().not().isEmpty().toDate()
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid payment id'),
        body('merchant_id').exists().not().isEmpty().isString(),
        body('order_id').exists().not().isEmpty().isString(),
        body('invoice_no').exists().not().isEmpty().isString(),
        body('currency').exists().not().isEmpty().isString(),
        body('amount').exists().not().isEmpty().isNumeric(),
        body('request_timestamp').exists().not().isEmpty().toDate()
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
        param('start_price').optional().isNumeric().toFloat(),
        param('end_price').optional().isNumeric().toFloat(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
        param('session_id').optional(),
    ]
}

const changeStatus = () => {
    return [
        body('payment_id').exists().isUUID(4).withMessage('Please provide a valid payment id'),
        body('payment_status').exists().not().isEmpty().isString()
    ]
}

const uploadPayment = () => {
    return [
        body('payment_id').exists().isUUID(4).withMessage('Please provide a valid payment id'),
        body('payment_image').optional()
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
    changeStatus,
    uploadPayment
}