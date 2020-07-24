const { success } = require('../services/httpRes');

const satuanRepository = require('../repositories/satuan');

const CreateOneNewSatuan = async (req, res, next) => {
  try {
    const { nama_satuan } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const satuanData = { nama_satuan };

    if (isAdmin) {
      satuanData.brand_id = null;
    } else {
      satuanData.brand_id = brand_id;
    }

    const satuan = await satuanRepository.CreateOne(satuanData);

    if (!satuan.status) {
      throw satuan.err;
    }

    return success(res, 201, satuan.data);
  } catch (err) {
    return next(err);
  }
};

const CreateManyNewSatuan = async (req, res, next) => {
  try {
    const { nama_satuan } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const satuanData = { nama_satuan };

    if (isAdmin) {
      satuanData.brand_id = null;
    } else {
      satuanData.brand_id = brand_id;
    }

    const satuans = await satuanRepository.CreateMany(satuanData);

    if (!satuans.status) {
      throw satuans.err;
    }

    return success(res, 201, satuans.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllSatuans = async (req, res, next) => {
  try {
    const { nama_satuan, page, per_page } = req.query;
    const params = { nama_satuan };
    const pagination = { page, per_page };

    const satuans = await satuanRepository.FindMany(params, pagination);

    if (!satuans.status) {
      throw satuans.err;
    }

    return success(res, 200, satuans.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneSatuan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const satuan = await satuanRepository.FindOne(id);

    if (!satuan.status) {
      throw satuan.err;
    }

    return success(res, 200, satuan.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateOneNewSatuan,
  CreateManyNewSatuan,
  FindAllSatuans,
  FindOneSatuan,
};
