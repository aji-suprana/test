const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/rekening');
const rekening = require('../app/controllers/rekening');
const checkBrand = require('../app/middlewares/checkBrand');
const admin = require('../app/middlewares/admin'); // selain admin tidak boleh request

router.post(
  '/',
  validationRules.CreateNewRekening(),
  validate,
  rekening.CreateNewRekening
);

router.get(
  '/',
  validationRules.FindAllRekenings(),
  validate,
  rekening.FindAllRekenings
);

router.get(
  '/:id',
  validationRules.FindOneRekening(),
  validate,
  rekening.FindOneRekening
);

router.patch(
  '/:id',
  validationRules.UpdateRekening(),
  validate,
  admin,
  rekening.UpdateRekening
);

router.delete(
  '/:id',
  validationRules.DeleteRekening(),
  validate,
  admin,
  rekening.DeleteRekening
);

var routeProps = {
  route: router,
  needAuth: true,
};

module.exports = routeProps;
