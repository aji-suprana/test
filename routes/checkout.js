const express = require('express');
const router = express.Router();
const checkout = require('../app/controllers/checkout');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/checkout');

router.post('/', validationRules.save(), validate, checkout.save);
router.get('/:id', validationRules.findById(), validate, checkout.findById);
router.get('/', validationRules.findAll(), validate, checkout.findAll);
router.patch('/:id', validationRules.update(), validate, checkout.update);
router.delete('/:id', validationRules.destroy(), validate, checkout.destroy);
router.put('/change_status', validationRules.changeStatus(), validate, checkout.changeStatus);
router.put('/add_promo', validationRules.addPromo(), validate, checkout.addPromo);
router.put('/remove_promo', validationRules.removePromo(), validate, checkout.removePromo);

module.exports = router;
