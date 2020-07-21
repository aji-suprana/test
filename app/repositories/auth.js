const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const flaverr = require('flaverr');

const { User } = require('../models');

const emailToken = require('../services/emailToken');
const forgotPasswordToken = require('../services/forgotPasswordToken');
const emailLib = require('../services/emails');
const randomKey = require('../services/randomKey');
const encryption = require('../services/encryption');
const getRole = require('../api/authorization');

const jwtSecret = process.env.JWT_SECRET;
const LandingUrl = process.env.LANDING_BASE_URL;

/**
 * Register a User
 * @param {Object} data Data
 * @param {String} data.email Email User
 * @param {String} data.username Username User
 * @param {String} data.password Password User
 * @param {Object} transaction Transaction object
 * @returns Object containing status and data or error
 */

const register = async (data, transaction = {}) => {
  try {
    let { username, email, password } = data;

    const hashPassword = bcrypt.hashSync(password, 10);
    password = hashPassword;

    const userData = { username, email, password };
    const createUser = await User.create(userData, { transaction });

    return {
      status: true,
      data: createUser,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Send Verification Code to Email
 * @param {Object} data Data
 * @param {String} data.id UUID dari User
 * @param {String} data.email Email User
 * @param {String} data.username Username User
 * @param {Object} flag Flag
 * @param {Boolean} flag.isNew Apakah user baru akan diregister?
 * @param {Object} transaction Transaction object
 * @returns Object containing status and data or error
 */

const sendVerifEmail = async (
  data,
  flag = { isNew: false },
  transaction = {}
) => {
  try {
    const { id, email, username } = data;

    // jika user sudah terdaftar
    if (!flag.isNew) {
      const user = await User.findOne({ where: { id } });

      if (!user) {
        throw flaverr('E_NOT_FOUND', Error(`user with id: ${id} is not found`));
      }

      if (user.isVerified) {
        throw flaverr('E_USER_VERIFIED', Error('user already verified'));
      }
    }

    const verifToken = await emailToken.generate({ user_id: id }, transaction);
    await emailLib.sendVerificationEmail(
      email,
      username,
      LandingUrl,
      verifToken,
      id
    );

    return {
      status: true,
      data: verifToken,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const verifyEmail = async (data) => {
  try {
    const verifToken = await emailToken.verify(data);

    if (!verifToken) {
      throw flaverr('E_FAILED_VERIFY', Error('failed to verify your email'));
    }

    return {
      status: true,
      data: verifToken,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const login = async (data) => {
  try {
    const token = jwt.sign(data, jwtSecret, { expiresIn: '1m' });

    const userRole = await getRole(data.user_id, token);
    const payload = data;

    if (!userRole.status) {
      payload.role_id = '';
    } else {
      payload.role_id = userRole.data;
    }

    const newToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    const key = randomKey();

    if (!key.success) {
      throw flaverr('E_ENCRYPT_KEY', Error(key.message));
    }

    return {
      status: true,
      data: {
        user: data,
        token: newToken,
        serverSecret: key.data.encryptedKey,
      },
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const validateToken = async (data) => {
  try {
    const verifyJwt = jwt.verify(data, jwtSecret);

    if (!verifyJwt) {
      throw flaverr('E_INVALID_TOKEN', Error('token is not valid'));
    }

    return {
      status: true,
      data: jwt.decode(data),
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const sendForgotPassword = async (data) => {
  try {
    const forgotPasswordData = await forgotPasswordToken.generate({
      email: data.email,
    });

    const user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`user with email ${email} is not found`)
      );
    }

    await emailLib.sendForgotPasswordEmail(
      data.email,
      user.username,
      forgotPasswordData.url,
      forgotPasswordData.expired,
      forgotPasswordData.token
    );

    return Promise.resolve({
      status: true,
      data: forgotPasswordData,
    });
  } catch (err) {
    return Promise.reject({
      status: false,
      err: err,
    });
  }
};

const verifyForgotPasswordToken = async (data) => {
  try {
    const verifyToken = await forgotPasswordToken.verify({
      token: data.token,
    });

    const payloadToken = {
      user_id: verifyToken.data.id,
      email: verifyToken.data.email,
      username: verifyToken.data.username,
      is_verified: verifyToken.data.isVerified,
    };

    const token = jwt.sign(payloadToken, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const key = randomKey();
    if (!key.success) throw flaverr('E_ENCRYPT_KEY', Error(key.message));

    const encryptToken = encryption.encrypt({
      key: key.data.plainKey,
      plain: token,
    }).data;

    return Promise.resolve({
      status: true,
      data: {
        token: encryptToken,
        serverSecret: key.data.encryptedKey,
      },
    });
  } catch (err) {
    return Promise.reject({
      status: false,
      err: err,
    });
  }
};

module.exports = {
  register,
  sendVerifEmail,
  verifyEmail,
  login,
  validateToken,
  sendForgotPassword,
  verifyForgotPasswordToken,
};
