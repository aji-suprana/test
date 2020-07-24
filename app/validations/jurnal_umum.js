const { body, query, param, header } = require('express-validator');
const tanggal = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

const Create = () => {
  return [
    header('x-brand').exists().notEmpty().isUUID(),
    body('tanggal')
      .exists()
      .notEmpty()
      .isString()
      .matches(tanggal)
      .withMessage('please input date with YYYY-MM-DD format'),
    body('nomor_invoice').exists().notEmpty().isString(),
    body('modul').exists().notEmpty().isString(),
    body('credits').exists().notEmpty().isArray(),
    body('credits.*.nominal').exists().notEmpty().isDecimal(),
    body('credits.*.rekening').exists().notEmpty().isUUID(),
    body('debits').exists().notEmpty().isArray(),
    body('debits.*.nominal').exists().notEmpty().isDecimal(),
    body('debits.*.rekening').exists().notEmpty().isUUID(),
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
    param('id').exists().notEmpty().isUUID()
  ];
};

const FindOne = () => {
  return [
    param('id').optional().notEmpty().isUUID(),
    param('nomor_invoice').optional().notEmpty().isUUID()
  ];
};

const Update = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jurnal_umum_id'),
    body('tanggal')
      .optional()
      .notEmpty()
      .isString()
      .matches(tanggal)
      .withMessage('please input date with YYYY-MM-DD format'),
    body('modul').optional().notEmpty().isString(), // FIXME: enum
  ];
};

const Destroy= () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jurnal_umum_id'),
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
