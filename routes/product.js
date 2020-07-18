const express = require('express');
const router = express.Router();
const product = require('../app/controllers/product');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/product');

/* GET live video listing. */
router.post('/', validationRules.save(), validate, product.save);
router.get('/:id', validationRules.findById(), validate, product.findById);
router.get('/', validationRules.findByAll(), validate, product.findAll);
router.patch('/:id', validationRules.update(), validate, product.update);
router.delete('/:id', validationRules.destroy(), validate, product.destroy);

router.put('/add_stock/:id', validationRules.addStock(), validate, product.addStock);
router.put('/reduce_stock/:id', validationRules.reduceStock(), validate, product.reduceStock);

module.exports = router;
