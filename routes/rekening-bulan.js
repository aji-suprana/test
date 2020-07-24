const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/rekening_bulan');
const rekening_bulan = require('../app/controllers/rekening_bulan');

router.post(
  '/',
  validationRules.Create(),
  validate,
  rekening_bulan.Create
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  rekening_bulan.FindAll
);

router.get(
  '/:id',
  validationRules.FindById(),
  validate,
  rekening_bulan.FindById
);

router.put(
  '/:id',
  validationRules.Update(),
  validate,
  rekening_bulan.Update
);

router.delete(
  '/:id',
  validationRules.Destroy(),
  validate,
  rekening_bulan.Destroy
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
