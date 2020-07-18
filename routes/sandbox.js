const express = require('express');
const router = express.Router();
const sandbox = require('../app/controllers/sandbox');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/promo');

router.get('/', sandbox);

module.exports = router;
