const { query, param } = require('express-validator');

const FindAllKelompoks = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneKelompok = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid kelompok_id'),
  ];
};

module.exports = {
  FindAllKelompoks,
  FindOneKelompok,
};
