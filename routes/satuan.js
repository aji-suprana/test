const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/satuan');
const satuan = require('../app/controllers/satuan');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateOneNewSatuan(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  satuan.CreateOneNewSatuan
);

router.post(
  '/bulk',
  validationRules.CreateManyNewSatuan(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  satuan.CreateManyNewSatuan
);

router.get(
  '/',
  validationRules.FindAllSatuans(),
  validate,
  satuan.FindAllSatuans
);

router.get(
  '/:id',
  validationRules.FindOneSatuan(),
  validate,
  satuan.FindOneSatuan
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
