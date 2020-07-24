const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/kategori_barang');
const kategoriBarang = require('../app/controllers/kategori_barang');

router.get(
  '/',
  validationRules.FindAllKategoriBarangs(),
  validate,
  kategoriBarang.FindAllKategoriBarangs
);

router.get(
  '/:id',
  validationRules.FindOneKategoriBarang(),
  validate,
  kategoriBarang.FindOneKategoriBarang
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
