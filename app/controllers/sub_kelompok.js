const { success } = require('../services/httpRes');

const subKelompokRepository = require('../repositories/sub_kelompok');

const library = {};

library.FindAllSubKelompoks = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const params = {};
    const pagination = { page, per_page };

    const subKelompoks = await subKelompokRepository.FindMany(
      params,
      pagination
    );

    if (!subKelompoks.status) {
      throw subKelompoks.err;
    }

    return success(res, 200, subKelompoks.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOneSubKelompok = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subKelompok = await subKelompokRepository.FindOne(id);

    if (!subKelompok.status) {
      throw subKelompok.err;
    }

    return success(res, 200, subKelompok.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
