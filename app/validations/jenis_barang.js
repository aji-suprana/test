const { body, param, query } = require('express-validator');

const CreateNewJenisBarang = () => {
  return [
    body('nama').exists().notEmpty().isString(),
    body('kode').exists().notEmpty().isString(),
    body('jenis_barang_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
  ];
};

const FindAllJenisBarangs = () => {
  return [
    query('nama').optional().notEmpty().isString().unescape(),
    query('kode').optional().notEmpty().isString().unescape(),
    query('brand_id').optional().notEmpty().isString(),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindAllJenisBarangParents = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneJenisBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
  ];
};

const UpdateJenisBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
    body('nama').exists().notEmpty().isString(),
    body('kode').exists().notEmpty().isString(),
    body('jenis_barang_id')
      .optional()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
  ];
};

const DeleteJenisBarang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_barang_id'),
  ];
};

module.exports = {
  CreateNewJenisBarang,
  FindAllJenisBarangs,
  FindAllJenisBarangParents,
  FindOneJenisBarang,
  UpdateJenisBarang,
  DeleteJenisBarang,
};
