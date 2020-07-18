const { validationResult } = require('express-validator');
const flaverr = require('flaverr');
const debug = require('../services/debug');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  debug.logHeader('validate request');
  if (errors.isEmpty()) return next();

  try {
    errors.array().map((err) => {
      throw flaverr('E_VALIDATION', Error(`${err.param}: ${err.msg}`));
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = validate;
