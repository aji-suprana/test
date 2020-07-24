const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/sub_kelompok');
const sub_kelompok = require('../app/controllers/sub_kelompok');

router.get(
  '/',
  validationRules.FindAllSubKelompoks(),
  validate,
  sub_kelompok.FindAllSubKelompoks
);

router.get(
  '/:id',
  validationRules.FindOneSubKelompok(),
  validate,
  sub_kelompok.FindOneSubKelompok
);

var routeProps = {
  route: router,
  needAuth: false,
};

module.exports = routeProps;
