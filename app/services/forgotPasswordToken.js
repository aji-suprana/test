const crypto = require('crypto');
const sequelize = require('../models/index').sequelize;
const Op = require('../models/index').Sequelize.Op;
const flaverr = require('flaverr');
const randomString = require('./randomString');
const userRepository = require('../repositories/user');

module.exports.generate = async (data) => {
	try {
		update = {};
		let date = new Date();
		date.setDate(date.getDate() + 1);

		update.password_reset_token = crypto.randomBytes(16).toString('hex');
		update.password_expired_token = date;
		update.password_token_used = false;

		let exist = await userRepository.update({
      where: { 
        email: data.email
      },
      exclude: ['password'],
      update: update
		});
		
		const result = {
			token: exist.data.password_reset_token,
			expired: exist.data.password_expired_token,
			url: `${process.env.LANDING_BASE_URL}/user/forgot-password-verify-token?token=${exist.data.password_reset_token}`
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
			where = {
		    [Op.and]: [
	       { password_expired_token: { [Op.gte]: new Date() }},
	       { password_reset_token: data.token },
	       { password_token_used: false }
		    ]
			}
		}
		else if(data.user_id && data.verif_code) {
			where.user_id = data.user_id;
			where.verif_code = data.verif_code;
		}

		let user = await userRepository.update({ 
			where: where,
		  exclude: ['password', 'credit', 'password_reset_token', 'password_expired_token'],
		  update: {
		  	password_token_used: true
		  }
		});
		 
		if (!user) throw flaverr('E_NOT_FOUND', Error(`token is invalid or expired`));

		return Promise.resolve(user);
	}
	catch (err) {
		return Promise.reject(err);
	}
}