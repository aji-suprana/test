const { body, query, param, header } = require('express-validator');

const Create = () => {
  return [
    header('x-brand').exists().notEmpty().isUUID(),
    body('tahun').exists().notEmpty().isInt(),
    body('rekening_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_id'),
  ];
};

const Update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_tahun_id'),
    body('rekening_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_id'),
  ];
};

const FindAll = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindById = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_tahun_id'),
  ];
};

const Destroy = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_tahun_id'),
  ];
};

module.exports = {
  Create,
  Update,
  FindAll,
  FindById,
  Destroy,
};
