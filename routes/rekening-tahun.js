const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/rekening_tahun');
const rekening_tahun = require('../app/controllers/rekening_tahun');

router.post(
  '/',
  validationRules.Create(),
  validate,
  rekening_tahun.Create
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  rekening_tahun.FindAll
);

router.get(
  '/:id',
  validationRules.FindById(),
  validate,
  rekening_tahun.FindById
);

router.put(
  '/:id',
  validationRules.Update(),
  validate,
  rekening_tahun.Update
);

router.delete(
  '/:id',
  validationRules.Destroy(),
  validate,
  rekening_tahun.Destroy
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
