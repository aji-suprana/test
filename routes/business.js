const express = require('express');
const router = express.Router();
const business = require('../app/controllers/business');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/business');

/* GET live video listing. */
router.post('/', validationRules.save(), validate, business.save);
router.get('/', business.findCurrent);
router.get('/list', validationRules.findByAll(), validate, business.findAll);
router.patch('/:id', validationRules.update(), validate, business.update);
router.delete('/:id', validationRules.destroy(), validate, business.destroy);

module.exports = router;
