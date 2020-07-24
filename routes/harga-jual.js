const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/harga_jual');
const hargaJual = require('../app/controllers/harga_jual');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateNewHargaJual(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  hargaJual.CreateNewHargaJual
);

router.get(
  '/',
  validationRules.FindAllHargaJuals(),
  validate,
  hargaJual.FindAllHargaJuals
);

router.get(
  '/:id',
  validationRules.FindOneHargaJual(),
  validate,
  hargaJual.FindOneHargaJual
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
