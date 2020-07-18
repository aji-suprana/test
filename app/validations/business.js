const { body, param, checkIf } = require('express-validator/check');

const save = () => {
    return [
        body('business_name').exists().not().isEmpty().isString(),
        body('business_description').optional().not().isEmpty(),
        body('streaming_estimate').exists().isNumeric(),
        body('business_address').exists().isString(),
        body('contact_link').optional().notEmpty().isString()
    ]
}

const update = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('business_name').optional().not().isEmpty().isString(),
        body('business_description').optional().not().isEmpty(),
        body('streaming_estimate').optional().isNumeric(),
        body('contact_link').optional().notEmpty().isString()
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
        param('business_name').optional().isString(),
        param('business_description').optional().isString(),
        param('start_hour').optional().isNumeric().toFloat(),
        param('end_hour').optional().isNumeric().toFloat(),
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
    findByAll
}