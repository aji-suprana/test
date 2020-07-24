const { body, query, param, header } = require('express-validator');

const Create = () => {
  return [
    header('x-brand').exists().notEmpty().isUUID(),
    body('nominal').exists().notEmpty().isDecimal(),
    body('jurnal_umum_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jurnal_umum_id'),
    body('rekening_bulan_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_bulan_id'),
    body('rekening_id')
      .exists()
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

const Update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid credit_id'),
    body('nominal').optional().notEmpty().isDecimal(),
    body('rekening_id').optional().notEmpty().isUUID(),
    body('rekening_bulan_id').optional().notEmpty().isUUID(),
  ];
};

const FindById = () => {
  return [
    param('id').exists().notEmpty().isUUID().withMessage('please input a valid debit_id'),
  ];
};

const FindOne = () => {
  return [
    param('id').optional().notEmpty().isUUID(),
    param('rekening_id').optional().notEmpty().isUUID(),
    param('jurnal_umum_id').optional().notEmpty().isUUID(),
    param('rekening_bulan_id').optional().notEmpty().isUUID(),
  ];
};

const Destroy = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid credit_id'),
  ];
};

module.exports = {
  Create,
  FindAll,
  FindById,
  FindOne,
  Update,
  Destroy,
};
