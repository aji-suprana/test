const express = require('express');
const router = express.Router();
const buyer = require('../app/controllers/buyer');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/buyer');

// buyer CRUD
router.post('/', validationRules.save(), validate, buyer.save);
router.get('/:id', validationRules.findById(), validate, buyer.findById);
router.get('/', validationRules.findByAll(), validate, buyer.findAll);
router.patch('/:id', validationRules.update(), validate, buyer.update);
router.delete('/:id', validationRules.destroy(), validate, buyer.destroy);

module.exports = router;