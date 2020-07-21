const bcrypt = require('bcryptjs');
const flaverr = require('flaverr');

const { User, Profile } = require('../models');

const changePassword = async (data) => {
	try {
		const currentUser = await User.findByPk(data.user_id);
    if (!currentUser) {
      throw flaverr('E_NOT_FOUND', Error(`user with id "${data.user_id}" is not exist`))
    }

    const verifyOldPassword = bcrypt.compareSync(data.old_password, currentUser.password);

    if (!verifyOldPassword) throw flaverr('E_UNAUTHORIZED', Error(`old password is not valid`));

    const hashPassword = bcrypt.hashSync(data.new_password, 10);

    currentUser.password = hashPassword;
    await currentUser.save();

    return Promise.resolve({
    	status: true
    });
	}
	catch (err) {
		return Promise.reject({
			status: false, 
			err: err
		});
	}
}

const findOne = async (data) => {
	try {
		const user = await User.findOne({
      where: {
        ...data.where
      },
      attributes: {
        exclude: data.exclude
      },
      include: {
        model: Profile,
        attributes: ['first_name', 'last_name']
      }
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user not found`));

    return Promise.resolve({
    	status: true,
    	data: user
    });
	}
	catch (err) {
		return Promise.reject({
			status: false,
			err: err
		});
	}
}

const findAndCountAll = async (data) => {
  try {
    const { count, rows } = await User.findAndCountAll({
      offset: data.offset,
      limit: data.per_page,
      where: {
        ...data.where
      },
      attributes: {
        exclude: data.exclude['password', 'password_expired_token', 'password_token_used', 'password_reset_token']
      }
    });

    return Promise.resolve({
      status: true,
      data: {
        count: count,
        rows: rows
      }
    })
  }
  catch (err) {
    return Promise.reject({
      status: false,
      err: err
    })
  }
}

const update = async (data) => {
  try {
    const user = await findOne({
      where: data.where,
      exclude: data.exclude,
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user is not exist`));

    Object.keys(data.update).forEach((key) => {
      if (key == 'password') data.update[key] = bcrypt.hashSync(data.update[key], 10);
      if (key == 'credit' && data.update[key] > 0) data.update[key] = Number.parseFloat(data.update[key]);
      user.data[key] = data.update[key];
    });

    await user.data.save();

    return Promise.resolve({
      status: true,
      data: user.data
    });
  }
  catch (err) {
    return Promise.reject({
      status: false,
      err: err
    })
  }
}

const destroy = async (data) => {
  try {
    const user = await findOne({
      where: data.where,
      exclude: []
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user is not exist`));

    // delete
    await user.destroy();

    return Promise.resolve({
      status: true
    })
  }
  catch (err) {
    return Promise.reject({
      status: false,
      err: err
    })
  }
}

module.exports = {
  findOne,
	changePassword,
  findAndCountAll,
  update,
  destroy
}