const { success } = require('../services/httpRes');

const jenisHargaJualRepo = require('../repositories/jenis_harga_jual');

const CreateOneNewJenisHargaJual = async (req, res, next) => {
  try {
    const { nama } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const jenisHargaJualData = { nama };

    if (isAdmin) {
      jenisHargaJualData.brand_id = null;
    } else {
      jenisHargaJualData.brand_id = brand_id;
    }

    const jenisHargaJual = await jenisHargaJualRepo.CreateOne(
      jenisHargaJualData
    );

    if (!jenisHargaJual.status) {
      throw jenisHargaJual.err;
    }

    return success(res, 201, jenisHargaJual.data);
  } catch (err) {
    return next(err);
  }
};

const CreateManyNewJenisHargaJual = async (req, res, next) => {
  try {
    const { nama } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const jenisHargaJualData = { nama };

    if (isAdmin) {
      jenisHargaJualData.brand_id = null;
    } else {
      jenisHargaJualData.brand_id = brand_id;
    }

    const jenisHargaJual = await jenisHargaJualRepo.CreateMany(
      jenisHargaJualData
    );

    if (!jenisHargaJual.status) {
      throw jenisHargaJual.err;
    }

    return success(res, 201, jenisHargaJual.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllJenisHargaJuals = async (req, res, next) => {
  try {
    const { nama, page, per_page } = req.query;
    const params = { nama };
    const pagination = { page, per_page };

    const jenisHargaJuals = await jenisHargaJualRepo.FindMany(
      params,
      pagination
    );

    if (!jenisHargaJuals.status) {
      throw jenisHargaJuals.err;
    }

    return success(res, 200, jenisHargaJuals.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneJenisHargaJual = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jenisHargaJual = await jenisHargaJualRepo.FindOne(id);

    if (!jenisHargaJual.status) {
      throw jenisHargaJual.err;
    }

    return success(res, 200, jenisHargaJual.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateOneNewJenisHargaJual,
  CreateManyNewJenisHargaJual,
  FindAllJenisHargaJuals,
  FindOneJenisHargaJual,
};
