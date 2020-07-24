const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/jenis_harga_jual');
const jenisHargaJual = require('../app/controllers/jenis_harga_jual');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateOneNewJenisHargaJual(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  jenisHargaJual.CreateOneNewJenisHargaJual
);

router.post(
  '/bulk',
  validationRules.CreateManyNewJenisHargaJual(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  jenisHargaJual.CreateManyNewJenisHargaJual
);

router.get(
  '/',
  validationRules.FindAllJenisHargaJuals(),
  validate,
  jenisHargaJual.FindAllJenisHargaJuals
);

router.get(
  '/:id',
  validationRules.FindOneJenisHargaJual(),
  validate,
  jenisHargaJual.FindOneJenisHargaJual
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
