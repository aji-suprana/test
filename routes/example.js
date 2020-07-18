const express = require('express');
const router = express.Router();
const validate = require('../app/middlewares/validation');
const validationRules = require('../app/validations/example');
const example = require('../app/controllers/example');

router.get('/', validationRules.save(), validate, example.save)
var routeProps = {
  route :  router,
  needAuth : false
}

module.exports = routeProps;
