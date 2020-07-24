const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/jenis_rekening');
const jenisRekening = require('../app/controllers/jenis_rekening');
const checkBrand = require('../app/middlewares/checkBrand');
const admin = require('../app/middlewares/admin'); // selain admin tidak boleh request

router.post(
  '/',
  validationRules.CreateNewJenisRekening(),
  validate,
  checkBrand,
  jenisRekening.CreateNewJenisRekening
);

router.get(
  '/',
  validationRules.FindAllJenisRekenings(),
  validate,
  jenisRekening.FindAllJenisRekenings
);

router.get(
  '/:id',
  validationRules.FindOneJenisRekening(),
  validate,
  jenisRekening.FindOneJenisRekening
);

router.patch(
  '/:id',
  validationRules.UpdateJenisRekening(),
  validate,
  admin,
  jenisRekening.UpdateJenisRekening
);

router.delete(
  '/:id',
  validationRules.DeleteJenisRekening(),
  validate,
  admin,
  jenisRekening.DeleteJenisRekening
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
