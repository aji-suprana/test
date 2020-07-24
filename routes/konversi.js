const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/konversi');
const konversi = require('../app/controllers/konversi');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateNewKonversi(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  konversi.CreateNewKonversi
);

router.get(
  '/',
  validationRules.FindAllKonversis(),
  validate,
  konversi.FindAllKonversis
);

router.get(
  '/:id',
  validationRules.FindOneKonversi(),
  validate,
  konversi.FindOneKonversi
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
