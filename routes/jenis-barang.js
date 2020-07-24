const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/jenis_barang');
const jenisBarang = require('../app/controllers/jenis_barang');
const checkPermission = require('../app/middlewares/checkPermission');
const ENV = process.env.NODE_ENV;

router.post(
  '/',
  validationRules.CreateNewJenisBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  jenisBarang.CreateNewJenisBarang
);

router.get(
  '/',
  validationRules.FindAllJenisBarangs(),
  validate,
  jenisBarang.FindAllJenisBarangs
);

router.get(
  '/parent',
  validationRules.FindAllJenisBarangParents(),
  validate,
  jenisBarang.FindAllJenisBarangParents
);

router.get(
  '/:id',
  validationRules.FindOneJenisBarang(),
  validate,
  jenisBarang.FindOneJenisBarang
);

router.put(
  '/:id',
  validationRules.UpdateJenisBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  jenisBarang.UpdateJenisBarang
);

router.delete(
  '/:id',
  validationRules.DeleteJenisBarang(),
  validate,
  ENV !== 'test' ? checkPermission : [],
  jenisBarang.DeleteJenisBarang
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
