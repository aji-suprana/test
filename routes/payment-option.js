const express = require('express');
const router = express.Router();
const paymentOption = require('../app/controllers/payment-option');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/payment-option');
const passport = require('passport');
const scope = require('../app/middlewares/scope');
const decryptToken = require('../app/middlewares/decrypt-token');

router.post('/', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.save(), validate, paymentOption.save);
router.get('/:id', validationRules.findById(), validate, paymentOption.findById);
router.get('/find-in-session/:id', paymentOption.getPaymentFromSession);
router.get('/', validationRules.findAll(), validate, paymentOption.findAll);
router.patch('/:id', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.update(), validate, paymentOption.update);
router.delete('/:id', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.destroy(), validate, paymentOption.destroy);

module.exports = router;
