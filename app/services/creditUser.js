const userRepository = require('../repositories/user');
const flaverr = require('flaverr');
module.exports.decrease = async (data) => {
	try {
    const {data: user} = await userRepository.findOne({
      where: {
        id: data.user_id
      },
      exclude: ['password']
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user is not exist`));

    const credit = Number.parseFloat(data.credit);

    if (user.credit < credit) throw flaverr('E_BAD_REQUEST', Error(`credit user is not enough`));

    user.credit = user.credit - credit;

    await user.save();

    return Promise.resolve(user);
	}
	catch (err) {
		return Promise.reject(err);
	}
}

module.exports.increase = async (data) => {
	try {
		const {data: user} = await userRepository.findOne({
      where: {
        id: data.user_id
      },
      exclude: ['password']
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user is not exist`));

    if (data.credit < 50000) throw flaverr('E_BAD_REQUEST', Error(`minimum credit is 50000`));

    user.credit = user.credit + Number.parseFloat(data.credit);

    await user.save();

    return Promise.resolve(user);
	}
	catch (err) {
		return Promise.reject(err);
	}
}
