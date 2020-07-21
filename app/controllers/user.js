const Op = require('../models/index').Sequelize.Op;
const { success } = require('../services/httpRes');
const emailToken = require('../services/emailToken');
const pagination = require('../services/pagination');
const encryption = require('../services/encryption');
const creditUser = require('../services/creditUser');
const randomKey = require('../services/randomKey');
const flaverr = require('flaverr');
const bcrypt = require('bcryptjs');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const debug = require('../services/debug')
const emailLib = require('../services/emails');
const userRepository = require('../repositories/user');
var library = {}

const AuthorizationService = process.env.AUTHORIZATION_SERVICE;
///////////////////////////////////////////////////////////////////////
// Change Password
//./todo-list/20200614-authentication
library.changePassword = async (req, res, next) =>
{
  debug.logHeader('Change Password');
  //TODO
  // ValidateToken from Authentication Service as middleware (DecryptToken)
  // get user_id from validatedToken response
  // get User table
  // compare oldpassword hash with existing one (bycrypt)
  // update password with new password
  try {
    const data = {
      user_id: req.user.user_id,
      old_password: req.body.old_password,
      new_password: req.body.new_password
    };

    const update = await userRepository.changePassword(data);

    return success(res, 201, null, 'password changed successfully');
  }
  catch(err) {
    return next(err);
  }
}

///////////////////////////////////////////////////////////////////////
// Get Authenticated
library.getAuthenticated = async (req, res, next) =>
{
  debug.logHeader("getAuthenticated");
  //TODO
  // ValidateToken, retrieve userdata
  // return user data

  try {
    debug.logData('user_id',req.user.user_id);

    const user = await userRepository.findOne({
      where: {
        id: req.user.user_id
      },
      exclude: ['password', 'password_reset_token', 'password_expired_token', 'password_token_used']
    });

    if (!user) throw flaverr('E_NOT_FOUND', `user not found`);

    return success(res, 200, user.data, `user is authenticated`);
  }
  catch (err) {
    return next(err);
  }
}

///////////////////////////////////////////////////////////////////////
// FindAll
library.findAll = async (req, res, next) => {
  try {
    //TODO: get tokenData, if tokenData.isAdmin==false return res 401
    //TODO: pagination

    req.query.page = req.query.page ? Number.parseInt(req.query.page) : 1;
    req.query.per_page = req.query.per_page ? Number.parseInt(req.query.per_page) : 10;
    const where = {}
    if (req.query.email) where.email = { [Op.like]: `%${req.query.email}%` }
    if (req.query.username) where.username = { [Op.like]: `%${req.query.username}%` }
    if (req.query.is_verified) where.is_verified = req.query.is_verified == 'true' ? true : false;

    const data = await userRepository.findAndCountAll({
      offset: (req.query.page - 1) * req.query.per_page,
      limit: req.query.per_page,
      where: where,
      exclude: ['password', 'password_expired_token', 'password_token_used', 'password_reset_token']
    });

    if (data.data.rows.length < 1) throw flaverr('E_NOT_FOUND', Error(`user not found`));

    const result = paginate({
      data: data.data.rows,
      count: data.data.count,
      page: req.query.page,
      per_page: req.query.per_page
    });

    return success(res, 200, result);
  } catch (err) {
    return next(err);
  }
};

///////////////////////////////////////////////////////////////////////
// Increase Credit
library.IncreaseCredit = async (req, res, next) => {
  //Validate Token
  //Minimum add credit 50 (CHECK TODO LIST ON ./model/user)
  //Add Credit

  try {
    const incresase = await creditUser.increase({
      user_id: req.user.user_id,
      credit: req.body.credit
    });

    return success(res, 201, incresase.user, `credit increased successfully`);
  }
  catch (err) {
    return next(err);
  }
}

///////////////////////////////////////////////////////////////////////
// Reduce Credit
library.ReduceCredit = async (req, res, next) => {
  //Validate Token
  // Has Enough Credit?
  //Remove Credit
  try {
    const decrease = await creditUser.decrease({
      user_id: req.user.user_id,
      credit: req.body.credit
    });

    return success(res, 201, decrease.user, `credit decreased successfully`);
  }
  catch(err) {
    return next(err);
  }
}

///////////////////////////////////////////////////////////////////////
// Find One
library.findOne = async (req, res, next) => {
  try {
    //TODO: get tokenData, if tokenData.isAdmin==false return res 401
    //TODO: pagination
    const { id } = req.params;
    const user = await userRepository.findOne({
      where: {
        id: id
      },
      exclude: ['password', 'password_expired_token', 'password_reset_token', 'password_token_used']
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id "${id}" is not exist`));

    return success(res, 200, user.data);
  }
  catch(err) {
    return next(err);
  }
};

library.update = async (req, res, next) => {
  try {
    const update = {};

    if (req.body.credit) update.credit = req.body.credit;
    if (req.body.password) update.password = req.body.password;

    const user = await userRepository.update({
      where: {
        id: req.params.id
      },
      exclude: [],
      update: update
    })

    const data = {
      id: user.data.id,
      credit: user.data.credit,
      updatedAt: user.data.updatedAt,
    };

    return success(res, 201, data);
  } catch (err) {
    next(err);
  }
};

///////////////////////////////////////////////////////////////////////
//  DEPRECATED/REMOVE
library.updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw flaverr('E_NOT_FOUND', Error(`user with id "${id}" is not exist`));
    }

    const verifyOldPassword = bcrypt.compareSync(old_password, user.password);

    if (!verifyOldPassword) {
      throw flaverr('E_BAD_REQUEST', Error('old password is invalid'));
    }

    // hash password
    const hashPassword = bcrypt.hashSync(new_password, 10);

    // save
    user.password = hashPassword;
    await user.save();

    return success(res, 201, null, 'password changed successfully');
  } catch (err) {
    return next(err)
  }
};

library.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userRepository.destroy({
      where: {
        id: id
      }
    });

    if (!user) throw flaverr('E_NOT_FOUND', Error(`user with id "${id}" is not exist`));

    return success(res, 201, user);
  } catch (err) {
    return next(err);
  }
};

module.exports=library;
