const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/alias');
const alias = require('../app/controllers/alias');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateNewAlias(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  alias.CreateNewAlias
);

router.get(
  '/',
  validationRules.FindAllAliases(),
  validate,
  alias.FindAllAliases
);

router.get(
  '/:id',
  validationRules.FindOneAlias(),
  validate,
  alias.FindOneAlias
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
