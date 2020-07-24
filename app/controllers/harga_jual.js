const { success } = require('../services/httpRes');

const hargaJualRepository = require('../repositories/harga_jual');

const CreateNewHargaJual = async (req, res, next) => {
  try {
    const { barang_id, qty_min, harga_jual, harga_jual_id } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const hargaJualData = { barang_id, qty_min, harga_jual, harga_jual_id };

    if (isAdmin) {
      hargaJualData.brand_id = null;
    } else {
      hargaJualData.brand_id = brand_id;
    }

    const hargaJual = await hargaJualRepository.Create(hargaJualData);

    if (!hargaJual.status) {
      throw hargaJual.err;
    }

    return success(res, 201, hargaJual.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllHargaJuals = async (req, res, next) => {
  try {
    const {
      barang_id,
      qty_min,
      harga_jual,
      harga_jual_id,
      page,
      per_page,
    } = req.query;
    const params = { barang_id, qty_min, harga_jual, harga_jual_id };
    const pagination = { page, per_page };

    const hargaJuals = await hargaJualRepository.FindMany(params, pagination);

    if (!hargaJuals.status) {
      throw hargaJuals.err;
    }

    return success(res, 200, hargaJuals.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneHargaJual = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hargaJual = await hargaJualRepository.FindOne(id);

    if (!hargaJual.status) {
      throw hargaJual.err;
    }

    return success(res, 200, hargaJual.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewHargaJual,
  FindAllHargaJuals,
  FindOneHargaJual,
};
