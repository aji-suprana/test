const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/barang');
const barang = require('../app/controllers/barang');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateNewBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  barang.CreateNewBarang
);

router.get(
  '/',
  validationRules.FindAllBarangs(),
  validate,
  barang.FindAllBarangs
);

router.get(
  '/:id',
  validationRules.FindOneBarang(),
  validate,
  barang.FindOneBarang
);

router.put(
  '/:id',
  validationRules.UpdateBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  barang.UpdateBarang
);

router.delete(
  '/:id',
  validationRules.DeleteBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  barang.DeleteBarang
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
