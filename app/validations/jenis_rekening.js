const { body, query, param, header } = require('express-validator');

const CreateNewJenisRekening = () => {
  return [
    header('brand-id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid brand_id'),
    body('nama').exists().notEmpty().isString(),
    body('nomor_jenis_rekening').exists().notEmpty().isString().isNumeric(),
    body('sub_kelompok_id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid sub_kelompok_id'),
  ];
};

const FindAllJenisRekenings = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneJenisRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid jenis_rekening_id'),
  ];
};

const UpdateJenisRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid jenis_rekening_id'),
    body('nama').exists().notEmpty().isString(),
    body('nomor_jenis_rekening').exists().notEmpty().isString().isNumeric(),
  ];
};

const DeleteJenisRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid jenis_rekening_id'),
  ];
};

module.exports = {
  CreateNewJenisRekening,
  FindAllJenisRekenings,
  FindOneJenisRekening,
  UpdateJenisRekening,
  DeleteJenisRekening,
};
