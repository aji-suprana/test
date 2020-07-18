const jwt = require('jsonwebtoken');
const encryption = require('../services/encryption');
const generateToken = require('../services/generate-token')

const register = async (req, res, next) => {
    try {
        const userExist = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        let isNewUser = true;
        if (userExist) isNewUser = false;

        const data = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            fb_id: req.body.fb_id
        }

        const accessToken = req.body.access_token;

        const user = await User.findOrCreate({
            where: {
                email: data.email
            },
            defaults: {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                fb_id: data.fb_id
            }
        });

        const currUser = user[0].dataValues;
        const userData = {
            email: currUser.email,
            last_name: currUser.last_name,
            first_name: currUser.first_name,
            id: currUser.id,
        }

        const tokenData = {
            accessToken: accessToken,
            userData: userData,
            fbId: data.fb_id,
        }

        let token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '90d' });
        token = encryption.encrypt(token);

        return res.status(200).json({
            status: 'success',
            token: token,
            flag: {
                is_new_user: isNewUser
            }
        });
    } catch (err) {
        return res.status(401).json({
            status: 'failed',
            message: err.message
        });
    }
}

const token = async (req, res, next) => {
    try {
        const cipherText = req.headers.authorization.split(/^Bearer\s+/);

        const decrypted = encryption.decrypt(cipherText[1]);
        console.log(decrypted)
        let refreshToken = jwt.verify(decrypted.data, process.env.JWT_SECRET)

        const accessToken = await Token.findOne({
            where: {
                id: refreshToken.token_id
            }
        })

        return res.status(200).json({
            status: 'success',
            token: accessToken.access_token
        });
    } catch (err) {
        return res.status(401).json({
            status: 'failed',
            message: err.message
        });
    }
}

module.exports = {
    register,
    token
}