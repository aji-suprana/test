const { body, query, param } = require('express-validator/check');

const save = () => {
  return [
    body('name').exists().notEmpty().isString(),
    body('cart_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid cart_id'),
  ];
};

const findAll = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
    query('cart_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid cart_id'),
  ];
};

const update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid tag_id'),
    body('name').exists().notEmpty().isString(),
    body('cart_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid cart_id'),
  ];
};

const destroy = () => {
  return [
    query('cart_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid cart_id'),
    query('name').exists().notEmpty().isString(),
  ];
};

module.exports = {
  save,
  findAll,
  update,
  destroy,
};
