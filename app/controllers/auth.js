const debug = require('../services/debug');
const { success } = require('../services/httpRes');

const authRepository = require('../repositories/auth');
const profileRepository = require('../repositories/profile');
const transactionRepo = require('../repositories/transaction');

var library = {};

library.register = async (req, res, next) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    // start transaction
    const transaction = await transactionRepo.Create();

    const userData = { username, email, password };
    const user = await authRepository.register(userData, transaction.data);

    if (!user.status) {
      await transactionRepo.Rollback(transaction.data);
      throw user.err;
    }

    const data = {
      id: user.data.id,
      username: user.data.username,
      first_name,
      last_name,
      email: user.data.email,
      credit: user.data.credit,
      isVerified: user.data.isVerified,
      createdAt: user.data.createdAt,
      updatedAt: user.data.updatedAt,
    };

    // send email verify token
    const verifEmailData = {
      id: data.id,
      username: data.username,
      email: data.email,
    };

    const verifyEmail = await authRepository.sendVerifEmail(
      verifEmailData,
      { isNew: true },
      transaction.data
    );

    if (!verifyEmail.status) {
      await transactionRepo.Rollback(transaction.data);
      throw verifyEmail.err;
    }

    // create profile
    const profileData = { user_id: data.id, first_name, last_name };
    const profile = await profileRepository.Create(
      profileData,
      transaction.data
    );

    if (!profile.status) {
      await transactionRepo.Rollback(transaction.data);
      throw profile.err;
    }

    // end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 200, data);
  } catch (err) {
    return next(err);
  }
};

library.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { user_id, verifcode } = req.body;

    const data = {
      token,
      user_id,
      verif_code: verifcode,
    };

    const verifToken = await authRepository.verifyEmail(data);

    if (!verifToken.status) {
      throw verifToken.err;
    }

    return success(res, 201, verifToken.data, 'email verified successfully');
  } catch (err) {
    return next(err);
  }
};

library.login = async (req, res, next) => {
  try {
    if (!req.user) {
      throw flaverr('E_UNAUTHORIZED', Error('unauthorized'));
    }

    const user = await authRepository.login(req.user);

    if (!user.status) {
      throw user.err;
    }

    return success(res, 200, user.data);
  } catch (err) {
    debug.logError(err);
    return next(err);
  }
};

library.validateToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];

    const validation = await authRepository.validateToken(bearerToken);

    if (!validation.status) {
      throw validation.err;
    }

    return success(res, 200, validation.data);
  } catch (err) {
    return next(err);
  }
};

library.resendVerifEmail = async (req, res, next) => {
  try {
    const { user_id, email, username } = req.user;
    const data = {
      id: user_id,
      email,
      username,
    };

    // start transaction
    const transaction = await transactionRepo.Create();

    const resendVerif = await authRepository.sendVerifEmail(
      data,
      { isNew: false },
      transaction.data
    );

    if (!resendVerif.status) {
      await transactionRepo.Rollback(transaction.data);
      throw resendVerif.err;
    }

    // end transaction
    await transactionRepo.Commit()

    return success(res, 200, null, 'token verify email sent successfully');
  } catch (err) {
    return next(err);
  }
};

///////////////////////////////////////////////////////////////////////
// Forgot Password
//./todo-list/20200614-authentication
library.forgotPassword = async (req, res, next) => {
  //TODO
  // check if email exist
  // select * from User where user.email=email
  // generate JWT token (persis dengan request login)
  // include jwt-token & server-secret dalam email dalam 1 button with form data

  try {
    await authRepository.sendForgotPassword({
      email: req.body.email,
    });

    return success(res, 200, null, `password reset token has been sent`);
  } catch (err) {
    return next(err);
  }
};

library.forgotPasswordVerify = async (req, res, next) => {
  try {
    const data = await authRepository.verifyForgotPasswordToken({
      token: req.query.token,
    });

    return success(
      res,
      200,
      data.data,
      `password reset token verified successfully`
    );
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
