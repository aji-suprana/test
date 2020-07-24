const { query, param } = require('express-validator');

const FindAllSubKelompoks = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneSubKelompok = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('please input a valid sub_kelompok_id'),
  ];
};

module.exports = {
  FindAllSubKelompoks,
  FindOneSubKelompok,
};
