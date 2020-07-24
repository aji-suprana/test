const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/debit');
const debit = require('../app/controllers/debit');

router.post(
  '/',
  validationRules.Create(),
  validate,
  debit.Create
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  debit.FindAll
);

router.get(
  '/find-one',
  validationRules.FindOne(),
  validate,
  debit.FindOne
);

router.get(
  '/:id',
  validationRules.FindById(),
  validate,
  debit.FindById
);

router.put(
  '/:id',
  validationRules.Update(),
  validate,
  debit.Update
);

router.delete(
  '/:id',
  validationRules.Destroy(),
  validate,
  debit.Destroy
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
