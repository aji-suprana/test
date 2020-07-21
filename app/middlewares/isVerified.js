const encryption = require('../services/encryption');
const jwt = require('jsonwebtoken');
const httpRes = require('../services/httpRes');
const flaverr = require('flaverr');

module.exports = async (req, res, next) => {
  try {
    if (req.user && req.user.is_verified == true) return next();
    else throw flaverr('E_NOT_VERIFIED', Error(`user is not verified`));
  } catch (err) {
    return next(err);
  }
};
