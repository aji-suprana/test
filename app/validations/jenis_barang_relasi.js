const { query } = require('express-validator');

const FindAllJenisBarangRelasis = () => {
  return [
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

module.exports = {
  FindAllJenisBarangRelasis,
};
