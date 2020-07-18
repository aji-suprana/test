const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('promo_name').exists().not().isEmpty().isString(),
        body('promo_code').exists().not().isEmpty().isString(),
        body('promo_discount').exists().not().isEmpty().isNumeric(),
        body('max_discount').exists().not().isEmpty().isNumeric(),
        body('min_ammount').exists().not().isEmpty().isNumeric(),
        body('description').exists().not().isEmpty().isString(),
        body('expired_at').exists().not().isEmpty().toDate(),
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid id'),
        body('promo_name').optional().not().isEmpty().isString(),
        body('promo_code').optional().not().isEmpty().isString(),
        body('promo_discount').optional().not().isEmpty().isNumeric(),
        body('max_discount').optional().not().isEmpty().isNumeric(),
        body('min_ammount').optional().not().isEmpty().isNumeric(),
        body('description').optional().not().isEmpty().isString(),
        body('expired_at').optional().not().isEmpty().toDate(),
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

module.exports = {
    save,
    update,
    destroy,
    findById,
    findAll
}