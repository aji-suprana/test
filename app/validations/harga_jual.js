const { body, param, query } = require('express-validator');

const CreateNewHargaJual = () => {
  return [
    body('barang_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid barang_id'),
    body('qty_min').exists().notEmpty().isInt({ min: 0 }),
    body('harga_jual').exists().notEmpty().isInt({ min: 0 }),
    body('harga_jual_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid harga_jual_id'),
  ];
};

const FindAllHargaJuals = () => {
  return [
    query('barang_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid barang_id'),
    query('qty_min').optional().notEmpty().isInt({ min: 0 }),
    query('harga_jual').optional().notEmpty().isInt({ min: 0 }),
    query('harga_jual_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_harga_jual_id'),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneHargaJual = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid harga_jual_id'),
  ];
};

module.exports = {
  CreateNewHargaJual,
  FindAllHargaJuals,
  FindOneHargaJual,
};
