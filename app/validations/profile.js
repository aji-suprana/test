const { body, param, query } = require('express-validator');

const CreateNewProfile = () => {
  return [
    body('user_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid user_id'),
    body('first_name').exists().notEmpty().isString(),
    body('last_name').exists().notEmpty().isString(),
  ];
};

const FindAllProfiles = () => {
  return [
    query('user_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid user_id'),
    query('first_name').optional().notEmpty().isString(),
    query('last_name').optional().notEmpty().isString(),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneProfile = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid profile_id'),
  ];
};

const UpdateProfile = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid profile_id'),
    body('first_name').exists().notEmpty().isString(),
    body('last_name').exists().notEmpty().isString(),
  ];
};

module.exports = {
  CreateNewProfile,
  FindAllProfiles,
  FindOneProfile,
  UpdateProfile,
};
