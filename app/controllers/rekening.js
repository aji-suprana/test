const { success } = require('../services/httpRes');

const rekeningRepository = require('../repositories/rekening');

const library = {};

library.CreateNewRekening = async (req, res, next) => {
  try {
    const { nama, nomor_rekening, jenis_rekening_id } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = false;

    const rekeningData = { nama, nomor_rekening, jenis_rekening_id };

    if (isAdmin) {
      rekeningData.is_default = true;
    } else {
      rekeningData.brand_id = brand_id;
      rekeningData.is_default = false;
    }

    const rekening = await rekeningRepository.Create(rekeningData);

    if (!rekening.status) {
      throw rekening.err;
    }

    return success(res, 201, rekening.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAllRekenings = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const params = {};
    const pagination = { page, per_page };

    const rekenings = await rekeningRepository.FindMany(params, pagination);

    if (!rekenings.status) {
      throw rekenings.err;
    }

    return success(res, 200, rekenings.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOneRekening = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekening = await rekeningRepository.FindOne(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    return success(res, 200, rekening.data);
  } catch (err) {
    return next(err);
  }
};

library.UpdateRekening = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, nomor_rekening } = req.body;
    const rekeningData = { nama, nomor_rekening };

    const rekening = await rekeningRepository.Update(id, rekeningData);

    if (!rekening.status) {
      throw rekening.err;
    }

    return success(res, 201, rekening.data);
  } catch (err) {
    return next(err);
  }
};

library.DeleteRekening = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekening = await rekeningRepository.Delete(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    return success(res, 201, rekening.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
