const { body, param, query, header } = require('express-validator');

const CreateNewAlias = () => {
  return [
    body('nama_general').exists().notEmpty().isString(),
    body('stok_min').exists().notEmpty().isInt({ min: 0 }),
  ];
};

const FindAllAliases = () => {
  return [
    query('nama_general').optional().notEmpty().isString().unescape(),
    query('stok_min').optional().notEmpty().isInt({ min: 0 }),
    query('page').optional().notEmpty().isInt({ min: 1 }),
    query('per_page').optional().notEmpty().isInt({ min: 1 }),
  ];
};

const FindOneAlias = () => {
  return [
    param('id')
      .exists()
      .notEmpty()
      .isUUID()
      .withMessage('please input a valid alias_id'),
  ];
};

module.exports = {
  CreateNewAlias,
  FindAllAliases,
  FindOneAlias,
};
