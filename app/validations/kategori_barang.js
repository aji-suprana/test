const { param, query } = require('express-validator');

const FindAllKategoriBarangs = () => {
  return [
    query('nama').optional().notEmpty().isString().unescape(),
    query('kode').optional().notEmpty().isString().unescape(),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneKategoriBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid kategori_barang_id'),
  ];
};

module.exports = {
  FindAllKategoriBarangs,
  FindOneKategoriBarang,
};
