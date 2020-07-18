const express = require('express');
const router = express.Router();
const user = require('../app/controllers/user');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/user');

/* GET live video listing. */
router.post('/', validationRules.save(), validate, user.save);
router.get('/:id', validationRules.findById(), validate, user.findById);
router.get('/', validationRules.findByAll(), validate, user.findAll);
router.patch('/:id', validationRules.update(), validate, user.update);
router.delete('/:id', validationRules.destroy(), validate, user.destroy);

module.exports = router;
