const { body } = require('express-validator/check');
const library = require('../controllers/payment_gateway');
var lirary = {}

const signPaymentToken = () => {
    return [
        body('version').exists().not().isEmpty().isString(),
        body('merchant_id').exists().not().isEmpty().isString(),
        body('result_url_1').exists().not().isEmpty().isString(),
        body('currency').exists().not().isEmpty().isString(),
        body('amount').exists().not().isEmpty().isString(),
        body('payment_description').exists().not().isEmpty().isString()
    ]
}

module.exports = {
    signPaymentToken
}