const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/credit');
const credit = require('../app/controllers/credit');

router.post(
  '/',
  validationRules.Create(),
  validate,
  credit.Create
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  credit.FindAll
);

router.get(
  '/find-one',
  validationRules.FindOne(),
  validate,
  credit.FindOne
);

router.get(
  '/:id',
  validationRules.FindById(),
  validate,
  credit.FindById
);

router.put(
  '/:id',
  validationRules.Update(),
  validate,
  credit.Update
);

router.delete(
  '/:id',
  validationRules.Destroy(),
  validate,
  credit.Destroy
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
