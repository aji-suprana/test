const express = require('express');
const router = express.Router();
const webhooks = require('../app/controllers/webhooks');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/promo');

router.get('/', webhooks);

module.exports = router;
