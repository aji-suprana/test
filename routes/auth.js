const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/auth');
const auth = require('../app/controllers/auth');
const passport = require('passport');
const decryptToken = require('../app/middlewares/decrypt-token');
const decryptJwtToken = require('../app/middlewares/decrypt-jwt-token');
const captcha = require('../app/middlewares/captcha');
const ENV = process.env.NODE_ENV

router.post(
  '/login',
  validationRules.login(),
  validate,
  ENV !== 'test' ? captcha : [],
  passport.authenticate('local', { session: false }),
  auth.login
);

router.post(
  '/register',
  validationRules.register(),
  validate,
  ENV !== 'test' ? captcha : [],
  auth.register
);

router.get('/validate', validationRules.validateToken(), validate, auth.validateToken);
router.get('/resend-verify-email', decryptJwtToken, auth.resendVerifEmail);
router.get(
  '/verify-email',
  validationRules.verifyEmail(),
  validate,
  auth.verifyEmail
);

router.post(
  '/verify-email',
  validationRules.verifyEmail(),
  validate,
  auth.verifyEmail
);

router.get(
  '/forgot-password-verify-token',
  validationRules.forgotPasswordVerifyToken(),
  validate,
  auth.forgotPasswordVerify
);

router.post(
  '/forgot-password',
  validationRules.forgotPassword(),
  validate,
  auth.forgotPassword
);


var routeProps = {
  route :  router,
  needAuth : false
}

module.exports = routeProps;
