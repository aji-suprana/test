const jwt = require('jsonwebtoken');
const encryption = require('../services/encryption');

const success = async (req, res, next) => {
    try {
        if (req.user) {
            const [user, created] = await Buyer.findOrCreate({
                where: {
                    email: req.user.userData.email
                },
                defaults: {
                    email: req.user.userData.email,
                    first_name: req.user.userData.first_name,
                    last_name: req.user.userData.last_name,
                    fb_id: req.user.userData.id
                }
            });

            req.user.fbId = req.user.userData.id;
            req.user.userData.id = user.toJSON().id;

            let token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: '90d' });
            token = encryption.encrypt(token);
            return res.status(200).json({
                status: 'success',
                token: token
            });
        }

        throw new Error('failed to authenticate');
    }
    catch (err) {
        return res.status(401).json({
            status: 'failed',
            message: err.message
        });
    }
}

module.exports = {
    success
}