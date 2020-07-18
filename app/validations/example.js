const { body } = require('express-validator');

const save = () => {
  return [
    //body('user_name').exists().notEmpty().isString().escape(),
    //body('password').exists().notEmpty().isString(),
    //body('jenis').exists().notEmpty().isString().isIn(['root', 'common']),
  ];
};

module.exports = {
  save,
};
