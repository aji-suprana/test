const express = require('express');
const router = express.Router();
const session = require('../app/controllers/session');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/session');

/* GET live video listing. */
router.post('/', validationRules.save(), validate, session.save);
router.get('/:id', validationRules.findById(), validate, session.findById);
router.get('/', validationRules.findByAll(), validate, session.findAll);
router.patch('/:id', validationRules.update(), validate, session.update);
router.delete('/:id', validationRules.destroy(), validate, session.destroy);
router.put('/addproducts', validationRules.addProducts(), validate, session.addProductToSession);
router.put('/removeproducts', validationRules.removeProducts(), validate, session.removeProductFromSession);
router.put('/add_deliveries', validationRules.addDeliveries(), validate, session.addDeliveryToSession);
router.put('/remove_deliveries', validationRules.removeDeliveries(), validate, session.removeDeliveryFromSession);
router.put('/add_payments', validationRules.addPayments(), validate, session.addPaymentToSession);
router.put('/remove_payments', validationRules.removePayments(), validate, session.removePaymentFromSession);

module.exports = router;
