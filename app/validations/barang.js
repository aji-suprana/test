const { body, param, query } = require('express-validator');
const { stock, nonStock } = require('../constants/tipeBarang');

const CreateNewBarang = () => {
  return [
    body('nama_barang').exists().notEmpty().isString(),
    body('kode_barang').exists().notEmpty().isString(),
    body('satuan_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_id'),
    body('konversi').exists().notEmpty().isArray(),
    body('konversi.*.id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid konversi_id'),
    body('konversi.*.nama_konversi').optional().notEmpty().isString(),
    body('konversi.*.barcode').exists().notEmpty().isString(),
    body('tipe_barang')
      .exists()
      .notEmpty()
      .isString()
      .isIn([stock, nonStock])
      .withMessage('please input: stock/non-stock'),
    body('harga_jual').exists().notEmpty().isArray(),
    body('harga_jual.*.id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_harga_jual_id'),
    body('harga_jual.*.qty_min').exists().notEmpty().isInt({ min: 0 }),
    body('harga_jual.*.harga_jual').exists().notEmpty().isInt({ min: 0 }),
    body('kategori_barang_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid kategori_barang_id'),
    body('alias_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid alias_id'),
    body('jenis_barang_id')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input an array of jenis_barang_id'),
    body('jenis_barang_id.*')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
    body('supplier_id')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input an array of supplier_id'),
    body('supplier_id.*')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid supplier_id'),
  ];
};

const FindAllBarangs = () => {
  return [
    query('nama_barang').optional().notEmpty().isString().unescape(),
    query('jenis_barang_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
    query('harga_jual').optional().notEmpty().isInt({ min: 0 }),
    query('stok_min').optional().notEmpty().isInt({ min: 0 }),
    query('supplier_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid supplier_id'),
    query('kategori_barang_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid kategori_barang_id'),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid barang_id'),
  ];
};

const UpdateBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid barang_id'),
    body('nama_barang').exists().notEmpty().isString(),
    body('kode_barang').exists().notEmpty().isString(),
    body('satuan_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_id'),
    body('konversi').exists().notEmpty().isArray(),
    body('konversi.*.id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid konversi_id'),
    body('konversi.*.nama_konversi').optional().notEmpty().isString(),
    body('konversi.*.barcode').exists().notEmpty().isString(),
    body('tipe_barang')
      .exists()
      .notEmpty()
      .isString()
      .isIn([stock, nonStock])
      .withMessage('please input: stock/non-stock'),
    body('harga_jual').exists().notEmpty().isArray(),
    body('harga_jual.*.id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_harga_jual_id'),
    body('harga_jual.*.qty_min').exists().notEmpty().isInt({ min: 0 }),
    body('harga_jual.*.harga_jual').exists().notEmpty().isInt({ min: 0 }),
    body('kategori_barang_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid kategori_barang_id'),
    body('alias_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid alias_id'),
    body('jenis_barang_id')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input an array of jenis_barang_id'),
    body('jenis_barang_id.*')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
    body('supplier_id')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input an array of supplier_id'),
    body('supplier_id.*')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid supplier_id'),
  ];
};

const DeleteBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid barang_id'),
  ];
};

module.exports = {
  CreateNewBarang,
  FindAllBarangs,
  FindOneBarang,
  UpdateBarang,
  DeleteBarang,
};
