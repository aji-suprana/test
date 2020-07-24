const { success } = require('../services/httpRes');

const kelompokRepository = require('../repositories/kelompok');

const library = {};

library.FindAllKelompoks = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const params = {};
    const pagination = { page, per_page };

    const kelompoks = await kelompokRepository.FindMany(params, pagination);

    if (!kelompoks.status) {
      throw kelompoks.err;
    }

    return success(res, 200, kelompoks.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOneKelompok = async (req, res, next) => {
  try {
    const { id } = req.params;

    const kelompok = await kelompokRepository.FindOne(id);

    if (!kelompok.status) {
      throw kelompok.err;
    }

    return success(res, 200, kelompok.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
