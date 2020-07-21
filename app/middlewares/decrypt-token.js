const encryption = require('../services/encryption');
const jwt = require('jsonwebtoken');
const httpRes = require('../services/httpRes');
const flaverr = require('flaverr');
const debug = require('../services/debug')
module.exports = async (req, res, next) => {
  try {
    debug.logHeader('decrypt-token')
    if (!req.headers.authorization) {
      throw flaverr(
        'E_INVALID_TOKEN',
        Error('token authentication is required')
      );
    }

    const cipherText = req.headers.authorization.split(/^Bearer\s+/);
    const encryptedKey = req.headers['server-secret'];

    const decryptedKey = encryption.decrypt({ cipher: encryptedKey });

    const decrypted = encryption.decrypt({
      key: decryptedKey.data,
      cipher: cipherText[1],
    });
    debug.logData('decrypted',decrypted);

    // check decryption process
    if (!decrypted.success) {
      throw flaverr('E_INVALID_TOKEN', Error(decrypted.success));
    }

    let tokenData;

    // checking expired token
    if (decrypted.data) {
      jwt.verify(decrypted.data, process.env.JWT_SECRET, (err, decoded) => {
        if (err) throw flaverr('E_INVALID_TOKEN', Error(err.message));

        tokenData = decrypted.data;
      });
    }

    req.headers.authorization = `Bearer ${tokenData}`;
    debug.logData('authorization',req.headers.authorization);

    return next();
  } catch (err) {
    return next(err);
  }
};
