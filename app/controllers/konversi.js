const { success } = require('../services/httpRes');

const konversiRepository = require('../repositories/konversi');

const CreateNewKonversi = async (req, res, next) => {
  try {
    const {
      nama_konversi,
      satuan_tujuan,
      satuan_asal,
      conversion_rate,
    } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const konversiData = {
      nama_konversi,
      satuan_tujuan,
      satuan_asal,
      conversion_rate,
    };

    if (isAdmin) {
      konversiData.brand_id = null;
    } else {
      konversiData.brand_id = brand_id;
    }

    const konversi = await konversiRepository.Create(konversiData);

    if (!konversi.status) {
      throw konversi.err;
    }

    return success(res, 201, konversi.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllKonversis = async (req, res, next) => {
  try {
    const { satuan_tujuan, satuan_asal, page, per_page } = req.query;

    const params = { satuan_tujuan, satuan_asal };
    const pagination = { page, per_page };

    const konversis = await konversiRepository.FindMany(params, pagination);

    if (!konversis.status) {
      throw konversis.err;
    }

    return success(res, 200, konversis.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneKonversi = async (req, res, next) => {
  try {
    const { id } = req.params;

    const konversi = await konversiRepository.FindOne(id);

    if (!konversi.status) {
      throw konversi.err;
    }

    return success(res, 200, konversi.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewKonversi,
  FindAllKonversis,
  FindOneKonversi,
};
