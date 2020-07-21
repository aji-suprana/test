const { body, param, query, header } = require('express-validator');
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/;

const findAll = () => {
  return [];
};

const findOne = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid user id'),
  ];
};

const update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid user id'),
    body('credit')
      .optional()
      .notEmpty()
      .isNumeric(),
    body('password')
      .optional()
      .notEmpty()
      .matches(regexPassword)
      .withMessage(
        'Password should be combination of one uppercase , one lower case, one number and min 8, max 20 char long'
      )
      .escape(),
  ];
};

const changePassword = () => {
  return [
    body('old_password')
      .exists()
      .notEmpty()
      .matches(regexPassword)
      .withMessage(
        'Password should be combination of one uppercase , one lower case, one number and min 8, max 20 char long'
      ),

    body('new_password')
      .exists()
      .notEmpty()
      .matches(regexPassword)
      .withMessage(
        'Password should be combination of one uppercase , one lower case, one number and min 8, max 20 char long'
      ),
  ];
}

const destroy = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid user id'),
  ];
};

const getAuthenticated = () => {
  return [
    header('server-secret').exists().notEmpty(),
    header('authorization').exists().notEmpty(),
  ];
};

const increaseCredit = () => {
  return [
    body('credit').exists().isNumeric().notEmpty()
  ]
};

const decreaseCredit = () => {
  return [
    body('credit').exists().isNumeric().notEmpty()
  ]
};

module.exports = {
  findAll,
  findOne,
  update,
  changePassword,
  destroy,
  getAuthenticated,
  increaseCredit,
  decreaseCredit,
};
