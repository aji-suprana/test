const express = require('express');
const router = express.Router();
const deliveryStatus = require('../app/controllers/delivery-status');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/delivery-status');

router.post('/', validationRules.save(), validate, deliveryStatus.save);
router.get('/:id', validationRules.findById(), validate, deliveryStatus.findById);
router.get('/', validationRules.findAll(), validate, deliveryStatus.findAll);
router.patch('/:id', validationRules.update(), validate, deliveryStatus.update);
router.delete('/:id', validationRules.destroy(), validate, deliveryStatus.destroy);

module.exports = router;
