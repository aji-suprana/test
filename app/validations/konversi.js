const { body, param, query, header } = require('express-validator');

const CreateNewKonversi = () => {
  return [
    body('satuan_tujuan')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_tujuan'),
    body('satuan_asal')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_asal'),
    body('conversion_rate').exists().notEmpty().isInt({ min: 1 }),
  ];
};

const FindAllKonversis = () => {
  return [
    query('satuan_tujuan')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_tujuan'),
    query('satuan_asal')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_asal'),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneKonversi = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid konversi_id'),
  ];
};

module.exports = {
  CreateNewKonversi,
  FindAllKonversis,
  FindOneKonversi,
};
