const encryption = require('../services/encryption');
const jwt = require('jsonwebtoken')
const debug = require("../services/debug")
const decrypt = (req, res, next) => {
   
    if (!req.headers.authorization) {
        return res.status(422).json({
            status: 'failed',
            message: 'token authentication is required'
        });
    }

    const cipherText = req.headers.authorization.split(/^Bearer\s+/);


    const decrypted = encryption.decrypt(cipherText[1]);

    // check decryption process
    if (!decrypted.status) {
        debug.logError("DECRYPT-TOKEN.JS, failed to decrypt")
        return res.status(422).json({
            status: 'failed',
            message: decrypted.error
        })
    }

    // checking expired token
    if (decrypted.data) {
        jwt.verify(decrypted.data, process.env.JWT_SECRET, (err) => {
            if (err) {
                return res.status(422).json({
                    status: 'failed',
                    message: err.message
                })
            }
        })
    }

    if (decrypted.status) {
        req.headers.authorization = `Bearer ${decrypted.data}`;
        debug.logData('success', true);
        return next();
    }

    return res.status(422).json({
        status: 'failed',
        message: 'invalid token'
    });
}

module.exports = decrypt;