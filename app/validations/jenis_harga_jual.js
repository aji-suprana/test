const { body, param, query } = require('express-validator');

const CreateOneNewJenisHargaJual = () => {
  return [body('nama').exists().notEmpty().isString()];
};

const CreateManyNewJenisHargaJual = () => {
  return [
    body('nama')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input array of nama'),
    body('nama.*')
      .exists()
      .notEmpty()
      .isString()
      .withMessage('please input string of nama'),
  ];
};

const FindAllJenisHargaJuals = () => {
  return [
    query('nama').optional().notEmpty().isString().unescape(),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneJenisHargaJual = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_harga_jual_id'),
  ];
};

module.exports = {
  CreateOneNewJenisHargaJual,
  CreateManyNewJenisHargaJual,
  FindAllJenisHargaJuals,
  FindOneJenisHargaJual,
};
