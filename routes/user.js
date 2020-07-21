const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const isVerified = require('../app/middlewares/isVerified');
const validationRules = require('../app/validations/user');
const user = require('../app/controllers/user');

router.get(
  '/',
  isVerified,
  validationRules.findAll(),
  validate,
  user.findAll
);

router.patch(
  '/change-password',
  isVerified,
  validationRules.changePassword(),
  validate,
  user.changePassword
);

router.get(
  '/get-authenticated',
  validationRules.getAuthenticated(),
  validate,
  user.getAuthenticated
);

router.post(
  '/increase-credit',
  isVerified,
  validationRules.increaseCredit(),
  validate,
  user.IncreaseCredit
);

router.post(
  '/decrease-credit',
  isVerified,
  validationRules.decreaseCredit(),
  validate,
  user.ReduceCredit
);

router.get(
  '/:id',
  isVerified,
  validationRules.findOne(),
  validate,
  user.findOne
);

router.patch(
  '/:id',
  isVerified,
  validationRules.update(),
  validate,
  user.update
);
var routeProps = {
  route :  router,
  needAuth : true
}

module.exports = routeProps;
