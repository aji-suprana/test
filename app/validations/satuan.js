const { body, param, query, header } = require('express-validator');

const CreateOneNewSatuan = () => {
  return [body('nama_satuan').exists().notEmpty().isString()];
};

const CreateManyNewSatuan = () => {
  return [
    body('nama_satuan')
      .exists()
      .notEmpty()
      .isArray()
      .withMessage('please input array of nama_satuan'),
    body('nama_satuan.*')
      .exists()
      .notEmpty()
      .isString()
      .withMessage('please input string of nama_satuan'),
  ];
};

const FindAllSatuans = () => {
  return [
    query('nama_satuan').optional().notEmpty().isString().unescape(),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneSatuan = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid satuan_id'),
  ];
};

module.exports = {
  CreateOneNewSatuan,
  CreateManyNewSatuan,
  FindAllSatuans,
  FindOneSatuan,
};
