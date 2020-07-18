const { success } = require('../services/httpRes');

const save = async (req, res) => {
  try {
    return success(res, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  save,
};
