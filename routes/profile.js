const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/profile');
const profile = require('../app/controllers/profile');

router.post(
  '/',
  validationRules.CreateNewProfile(),
  validate,
  profile.CreateNewProfile
);

router.get(
  '/',
  validationRules.FindAllProfiles(),
  validate,
  profile.FindAllProfiles
);

router.get(
  '/:id',
  validationRules.FindOneProfile(),
  validate,
  profile.FindOneProfile
);

router.patch(
  '/:id',
  validationRules.UpdateProfile(),
  validate,
  profile.UpdateProfile
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
