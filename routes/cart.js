const express = require('express');
const router = express.Router();
const cart = require('../app/controllers/cart');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/cart');

/* GET live video listing. */
router.get('/status', cart.GetCartStatus);
router.post('/', validationRules.save(), validate, cart.save);
router.get('/:id', validationRules.findById(), validate, cart.findById);
router.get('/', validationRules.findByAll(), validate, cart.findAll);
router.delete('/:id', validationRules.destroy(), validate, cart.destroy);
router.put('/addproducts', validationRules.addProducts(), validate, cart.addProductToCart);
router.patch('/removeproducts', validationRules.removeProducts(), validate, cart.removeProductFromCart);
router.put('/add_payment', validationRules.addPayment(), validate, cart.addPayment);
router.put('/remove_payment', validationRules.removePayment(), validate, cart.removePayment);
router.put('/add_delivery', validationRules.addDelivery(), validate, cart.addDelivery);
router.put('/update_delivery/:id', validationRules.updateDelivery(), validate, cart.updateDelivery);
router.put('/remove_delivery', validationRules.removeDelivery(), validate, cart.removeDelivery);
router.put('/add_quantity', validationRules.addQuantity(), validate, cart.addProductQuantity);
router.put('/reduce_quantity', validationRules.reduceQuantity(), validate, cart.reduceProductQuantity);
router.patch('/update_status', validationRules.UpdateCartStatus(), validate, cart.UpdateCartStatus);



module.exports = router;
