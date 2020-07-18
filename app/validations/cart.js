const { body, param, checkIf,every } = require('express-validator/check');
const lodash = require('lodash');
const debug = require('../services/debug')
const save = () => {
    return [
        body('session_id').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const update = () => {
    return []
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
        param('session_id').optional(),
    ]
}

const addProducts = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('products.*.id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('products.*.quantity').exists().isNumeric().toInt()
    ]
}

const removeProducts = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('products.*').exists().isUUID(4).withMessage('Please provide a valid product id')
    ]
}

const addPayment = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
        body('payment_id').exists().isUUID(4).withMessage('Please provide a valid payment id'),
    ]
}

const removePayment = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
    ]
}

const addDelivery = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
        body('delivery_id').exists().isUUID(4).withMessage('Please provide a valid delivery id'),
    ]
}

const updateDelivery = () => {
    return [
        param('id').exists().isUUID(4).withMessage('Please provide a valid cart id'),
        body('delivery_id').exists().isUUID(4).withMessage('Please provide a valid delivery id'),
    ]
}

const removeDelivery = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
    ]
}

const addQuantity = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
        body('product_id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('quantity').optional().isNumeric().toInt()
    ]
}

const reduceQuantity = () => {
    return [
        body('cart_id').exists().isUUID(4).withMessage('Please provide a valid checkout id'),
        body('product_id').exists().isUUID(4).withMessage('Please provide a valid product id'),
        body('quantity').optional().isNumeric().toInt()
    ]
}

const UpdateCartStatus = () => {
    return [
        body().isArray().custom(a => {
            // a holds the full array
            var valid = false;
            a.forEach((e) => {
                // e is each element in the array
                if (lodash.isObject(e)) 
                {
                    if (lodash.has(e, "cart_id") && lodash.has(e, "status"))
                    {
                        valid = true;
                    }
                    else
                    {
                        debug.logError("fields incorrect")
                    }
                } 
                else 
                {
                    debug.log("not an object");
                }
            })
            return valid;
        }).withMessage('Array must contains object with fields cart_id & status')   
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
    addPayment,
    removePayment,
    addDelivery,
    updateDelivery,
    removeDelivery,
    addQuantity,
    reduceQuantity,
    UpdateCartStatus,
}