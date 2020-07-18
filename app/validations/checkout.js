const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid cart id'),
        body('first_name').exists().not().isEmpty().isString(),
        body('last_name').exists().not().isEmpty().isString(),
        body('email').exists().not().isEmpty().isEmail(),
        body('buyer_country').exists().not().isEmpty().isString(),
        body('buyer_region').exists().not().isEmpty().isString(),
        body('buyer_zip_code').exists().not().isEmpty().isString(),
        body('buyer_address').exists().not().isEmpty().isString(),
        body('buyer_phone').exists().not().isEmpty().isString()
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid id'),
        body('cart_id').optional().isUUID(4).withMessage('Please provide a valid cart id'),
        body('first_name').optional().isString(),
        body('last_name').optional().isString(),
        body('email').optional().isEmail(),
        body('buyer_country').optional().not().isEmpty().isString(),
        body('buyer_region').optional().not().isEmpty().isString(),
        body('buyer_zip_code').optional().not().isEmpty().isString(),
        body('buyer_address').optional().not().isEmpty().isString(),
        body('buyer_phone').optional().not().isEmpty().isNumeric()
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
        param('checkout_code').optional(),
        param('user_id').optional(),
        param('session_id').optional(),
        param('start_price').optional().isNumeric().toFloat(),
        param('end_price').optional().isNumeric().toFloat(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
    ]
}

const changeStatus = () => {
    return [
        body('checkout_id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('cart_status').exists().not().isEmpty().isString()
    ]
}

const addPromo = () => {
    return [
        body('checkout_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
        body('promo_code').exists().isString().withMessage('Please provide a valid promo code'),
    ]
}

const removePromo = () => {
    return [
        body('checkout_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll,
    changeStatus,
    addPromo,
    removePromo,
}