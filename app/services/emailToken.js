const crypto = require('crypto');
const User = require('../models').User;
const EmailVerification = require('../models').EmailVerification;
const flaverr = require('flaverr');
const randomString = require('./randomString');

module.exports.generate = async (data, transaction = {}) => {
	try {
		let exist = await EmailVerification.findOne({
			where: {
				user_id: data.user_id
			}
		}, { transaction });

		if (exist) {
			exist.token = crypto.randomBytes(16).toString('hex');
			exist.verif_code = randomString(6).string
			await exist.save({ transaction });
		}
		else {
			exist = await EmailVerification.create({
				user_id: data.user_id,
				token: crypto.randomBytes(16).toString('hex'),
				verif_code: randomString(6).string
			}, { transaction });
		}

		const result = {
			token: exist.token,
			verif_code: exist.verif_code,
			url: `${process.env.LANDING_BASE_URL}/user/verify-email?token=${exist.token}`
		}

		return Promise.resolve(result);
	}
	catch (err) {
		return Promise.reject(err);
	}
}

module.exports.verify = async (data) => {
	try {
		let where = {};

		if (data.token) {
			where.token = data.token;
		}
		else if(data.user_id && data.verif_code) {
			where.user_id = data.user_id;
			where.verif_code = data.verif_code;
		}

		const exist = await EmailVerification.findOne({ where });

		if (!exist) throw flaverr('E_NOT_FOUND', Error(`token is invalid`));

		const userVerified = await User.findOne({
			where: {
				id: exist.user_id
			},
			attributes: {
	      exclude: ['password', 'credit', 'password_reset_token', 'password_expired_token', 'password_token_used']
	    }
		});

		if (userVerified.isVerified == true) throw flaverr('E_USER_VERIFIED', Error(`user already verified`));

		userVerified.isVerified = true;
		await userVerified.save();

		return Promise.resolve(userVerified);
	}
	catch (err) {
		return Promise.reject(err);
	}
}
