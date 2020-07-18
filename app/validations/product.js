const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('product_name').exists().not().isEmpty().isString(),
        body('product_code').exists().not().isEmpty().isString(),
        body('description').optional().not().isEmpty(),
        body('price').exists().isNumeric(),
        body('unit_measure').exists().isNumeric(),
        body('unit').exists().not().isEmpty().isString(),
        body('product_stock').exists().isNumeric()
    ]
}

const update = () => {
    return [
        body('product_name').optional().isString(),
        body('product_code').optional().isString(),
        body('description').optional().not().isEmpty(),
        body('price').optional().isNumeric(),
        body('unit_measure').optional().isNumeric(),
        body('unit').optional().not().isEmpty().isString(),
        body('product_stock').optional().isNumeric()
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

const addStock = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const reduceStock = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const findByAll = () => {
    return [
        param('product_name').optional().isString(),
        param('product_code').optional().isString(),
        param('description').optional(),
        param('start_price').optional().isNumeric().toFloat(),
        param('end_price').optional().isNumeric().toFloat(),
        param('page').optional().isNumeric().toInt(),
        param('per_page').optional().isNumeric().toInt(),
        param('user_id').optional(),
    ]
}

module.exports = {
    save,
    update,
    destroy,
    findById,
    findByAll,
    addStock,
    reduceStock
}