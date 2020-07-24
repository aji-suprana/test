const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/jurnal_umum');
const jurnal_umum = require('../app/controllers/jurnal_umum');

router.post(
  '/',
  validationRules.Create(),
  validate,
  jurnal_umum.Create
);

router.get(
  '/',
  validationRules.FindAll(),
  validate,
  jurnal_umum.FindAll
);

router.get(
  '/find-one',
  validationRules.FindOne(),
  validate,
  jurnal_umum.FindOne
);

router.get(
  '/:id',
  validationRules.FindById(),
  validate,
  jurnal_umum.FindById
);

router.put(
  '/:id',
  validationRules.Update(),
  validate,
  jurnal_umum.Update
);

router.delete(
  '/:id',
  validationRules.Destroy(),
  validate,
  jurnal_umum.Destroy
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
