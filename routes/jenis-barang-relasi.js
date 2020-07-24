const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/jenis_barang_relasi');
const jenisBarangRelasi = require('../app/controllers/jenis_barang_relasi');

router.get(
  '/',
  validationRules.FindAllJenisBarangRelasis(),
  validate,
  jenisBarangRelasi.FindAllJenisBarangRelasis
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
