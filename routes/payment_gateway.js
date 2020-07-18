const express = require('express');
const router = express.Router();
const paymentGateway = require('../app/controllers/payment_gateway');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/payment-gateway');
const decryptToken = require("../app/middlewares/decrypt-token");
const passport = require("passport");

router.post('/sign-payment-token',paymentGateway.signPaymentToken);
router.post('/', paymentGateway.readPaymentResponse);

module.exports = router;
