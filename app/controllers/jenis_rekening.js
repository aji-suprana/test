const { success } = require('../services/httpRes');

const jenisRekeningRepository = require('../repositories/jenis_rekening');

const library = {};

library.CreateNewJenisRekening = async (req, res, next) => {
  try {
    const { nama, nomor_jenis_rekening, sub_kelompok_id } = req.body;
    const brand_id = req.headers['brand-id'];
    const isAdmin = req.user.isAdmin;

    const jenisRekeningData = {
      nama,
      nomor_jenis_rekening,
      sub_kelompok_id,
    };

    if (isAdmin) {
      jenisRekeningData.is_default = true;
    } else {
      jenisRekeningData.brand_id = brand_id;
      jenisRekeningData.is_default = false;
    }

    const jenisRekening = await jenisRekeningRepository.Create(
      jenisRekeningData
    );

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    return success(res, 201, jenisRekening.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAllJenisRekenings = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;

    let params;
    const pagination = { page, per_page };

    const jenisRekenings = await jenisRekeningRepository.FindMany(
      params,
      pagination
    );

    if (!jenisRekenings.status) {
      throw jenisRekenings.err;
    }

    return success(res, 200, jenisRekenings.data);
  } catch (err) {
    return next(err);
  }
};

library.FindOneJenisRekening = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jenisRekening = await jenisRekeningRepository.FindOne(id);

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    return success(res, 200, jenisRekening.data);
  } catch (err) {
    return next(err);
  }
};

library.UpdateJenisRekening = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, nomor_jenis_rekening } = req.body;

    const jenisRekeningData = { nama, nomor_jenis_rekening };

    const jenisRekening = await jenisRekeningRepository.Update(
      id,
      jenisRekeningData
    );

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    return success(res, 201, jenisRekening.data);
  } catch (err) {
    return next(err);
  }
};

library.DeleteJenisRekening = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jenisRekening = await jenisRekeningRepository.Delete(id);

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    return success(res, 201, jenisRekening.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
