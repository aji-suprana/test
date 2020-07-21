const { body, query, header } = require('express-validator');
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/;

const register = () => {
  return [
    body('token').exists().notEmpty().isString(),
    body('first_name').exists().notEmpty().isString(),
    body('last_name').exists().notEmpty().isString(),
    body('username').exists().notEmpty().isString(),
    body('email').exists().notEmpty().isEmail(),
    body('password')
      .exists()
      .notEmpty()
      .isString()
      .matches(regexPassword)
      .withMessage(
        'Password should be combination of one uppercase , one lower case, one number and min 8, max 20 char long'
      )
  ];
};

const login = () => {
  return [
    body('token').exists().notEmpty().isString(),
    body('email').exists().notEmpty().isEmail(),
    body('password')
      .exists()
      .notEmpty()
      .isString()
      .matches(regexPassword)
      .withMessage(
        'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8, max 20 char long'
      ),
  ];
};

const verifyEmail = () => {
  return [
    query('token').optional().notEmpty().isString().escape(),
    body('verifcode')
      .optional()
      .notEmpty()
      .isString(),
    body('user_id')
      .optional()
      .notEmpty()
      .withMessage('please input a valid user id')
  ];
};

const validateToken = () => {
  return [
    header('server-secret').exists().notEmpty(),
    header('authorization').exists().notEmpty(),
  ];
};

const forgotPassword = () => {
  return [
    body('email').exists().notEmpty().isEmail()
  ]
};

const forgotPasswordVerifyToken = () => {
  return [
    query('token').exists().notEmpty().isString()
  ]
};

module.exports = {
  register,
  login,
  validateToken,
  verifyEmail,
  forgotPassword,
  forgotPasswordVerifyToken
};
