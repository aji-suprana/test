const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/kelompok');
const kelompok = require('../app/controllers/kelompok');

router.get(
  '/',
  validationRules.FindAllKelompoks(),
  validate,
  kelompok.FindAllKelompoks
);

router.get(
  '/:id',
  validationRules.FindOneKelompok(),
  validate,
  kelompok.FindOneKelompok
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
