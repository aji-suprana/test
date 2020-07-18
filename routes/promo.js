const express = require('express');
const router = express.Router();
const promo = require('../app/controllers/promo');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/promo');

router.post('/', validationRules.save(), validate, promo.save);
router.get('/:id', validationRules.findById(), validate, promo.findById);
router.get('/', validationRules.findAll(), validate, promo.findAll);
router.patch('/:id', validationRules.update(), validate, promo.update);
router.delete('/:id', validationRules.destroy(), validate, promo.destroy);

module.exports = router;
