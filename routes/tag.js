const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/tag');
const tag = require('../app/controllers/tag');

router.post('/', validationRules.save(), validate, tag.save);
router.get('/', validationRules.findAll(), validate, tag.findAll);
router.put('/:id', validationRules.update(), validate, tag.update);
router.delete('/', validationRules.destroy(), validate, tag.destroy);

module.exports = router;
