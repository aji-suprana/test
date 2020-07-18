const express = require('express');
const router = express.Router();
const delivery = require('../app/controllers/delivery');
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/delivery');
const passport = require('passport');
const scope = require('../app/middlewares/scope');
const decryptToken = require('../app/middlewares/decrypt-token');

router.post('/', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.save(), validate, delivery.save);
router.get('/find-in-session/:id',delivery.getDeliveryFromSession);
router.get('/:id', validationRules.findById(), validate, delivery.findById);
router.get('/', decryptToken, passport.authenticate('jwt', { session: false }), validationRules.findAll(), validate, delivery.findAll);
router.patch('/:id', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.update(), validate, delivery.update);
router.delete('/:id', decryptToken, passport.authenticate('jwt', { session: false }), scope, validationRules.destroy(), validate, delivery.destroy);


module.exports = router;
