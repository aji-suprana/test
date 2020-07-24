const { success } = require('../services/httpRes');

const jenisBarangRelasiRepo = require('../repositories/jenis_barang_relasi');

const FindAllJenisBarangRelasis = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const params = {};
    const pagination = { page, per_page };

    const jenisBarangRelasi = await jenisBarangRelasiRepo.FindMany(
      params,
      pagination
    );

    if (!jenisBarangRelasi.status) {
      throw jenisBarangRelasi.err;
    }

    return success(res, 200, jenisBarangRelasi.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = { FindAllJenisBarangRelasis };
