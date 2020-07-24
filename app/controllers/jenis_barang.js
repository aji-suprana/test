const { success } = require('../services/httpRes');

const jenisBarangRepo = require('../repositories/jenis_barang');

const CreateNewJenisBarang = async (req, res, next) => {
  try {
    const { nama, kode, jenis_barang_id } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const jenisBarangData = { nama, kode, jenis_barang_id };

    if (isAdmin) {
      jenisBarangData.brand_id = null;
    } else {
      jenisBarangData.brand_id = brand_id;
    }

    const jenisBarang = await jenisBarangRepo.Create(jenisBarangData);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    return success(res, 201, jenisBarang.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllJenisBarangs = async (req, res, next) => {
  try {
    // mungkin nanti brand_id di header, kalau ada
    const { nama, kode, brand_id, page, per_page } = req.query;
    const params = { nama, kode, brand_id };
    const pagination = { page, per_page };

    const jenisBarangs = await jenisBarangRepo.FindMany(params, pagination);

    if (!jenisBarangs.status) {
      throw jenisBarangs.err;
    }

    return success(res, 200, jenisBarangs.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllJenisBarangParents = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const params = {};
    const pagination = { page, per_page };

    const jenisBarangs = await jenisBarangRepo.FindAllParent(
      params,
      pagination
    );

    if (!jenisBarangs.status) {
      throw jenisBarangs.err;
    }

    return success(res, 200, jenisBarangs.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneJenisBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jenisBarang = await jenisBarangRepo.FindOne(id);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    return success(res, 200, jenisBarang.data);
  } catch (err) {
    return next(err);
  }
};

const UpdateJenisBarang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama, kode, jenis_barang_id } = req.body;
    const isAdmin = req.user.is_admin;

    const jenisBarangData = { nama, kode, jenis_barang_id };

    if (isAdmin) {
      jenisBarangData.brand_id = null;
    } else {
      jenisBarangData.brand_id = brand_id;
    }

    const jenisBarang = await jenisBarangRepo.Update(id, jenisBarangData);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    return success(res, 201, jenisBarang.data);
  } catch (err) {
    return next(err);
  }
};

const DeleteJenisBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jenisBarang = await jenisBarangRepo.Delete(id);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    return success(res, 201, jenisBarang.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewJenisBarang,
  FindAllJenisBarangs,
  FindAllJenisBarangParents,
  FindOneJenisBarang,
  UpdateJenisBarang,
  DeleteJenisBarang,
};
