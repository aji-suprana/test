const { body, query, param } = require('express-validator');

const CreateNewPiutang = () => {
  return [body('tanggal_jatuh_tempo').exists().notEmpty().isString().toDate()];
};

const FindAllPiutangs = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const UpdatePiutang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid piutang_id'),
    body('tanggal_jatuh_tempo').exists().notEmpty().isString().toDate(),
  ];
};

const DeletePiutang = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid piutang_id'),
  ];
};

module.exports = {
  CreateNewPiutang,
  FindAllPiutangs,
  UpdatePiutang,
  DeletePiutang,
};
