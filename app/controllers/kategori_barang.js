const { success } = require('../services/httpRes');

const kategoriBarangRepository = require('../repositories/kategori_barang');

const FindAllKategoriBarangs = async (req, res, next) => {
  try {
    const { nama, kode, page, per_page } = req.query;
    const params = { nama, kode };
    const pagination = { page, per_page };

    const kategoriBarang = await kategoriBarangRepository.FindMany(
      params,
      pagination
    );

    if (!kategoriBarang.status) {
      throw kategoriBarang.err;
    }

    return success(res, 200, kategoriBarang.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneKategoriBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const kategoriBarang = await kategoriBarangRepository.FindOne(id);

    if (!kategoriBarang.status) {
      throw kategoriBarang.err;
    }

    return success(res, 200, kategoriBarang.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  FindAllKategoriBarangs,
  FindOneKategoriBarang,
};
