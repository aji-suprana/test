const { body, query, param, header } = require('express-validator');

const CreateNewRekening = () => {
  return [
    header('x-brand')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid brand_id'),
    body('nama').exists().notEmpty().isString(),
    body('nomor_rekening').exists().notEmpty().isString(),
    body('jenis_rekening_id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid jenis_rekening_id'),
  ];
};

const FindAllRekenings = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_id'),
  ];
};

const UpdateRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_id'),
    body('nama').exists().notEmpty().isString(),
    body('nomor_rekening').exists().notEmpty().isString(),
  ];
};

const DeleteRekening = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid rekening_id'),
  ];
};

module.exports = {
  CreateNewRekening,
  FindAllRekenings,
  FindOneRekening,
  UpdateRekening,
  DeleteRekening,
};
