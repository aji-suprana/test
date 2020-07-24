const { Kelompok, sequelize, Sequelize } = require('../../models');

const flaverr = require('flaverr');

const saveKelompok = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const kelompok = await Kelompok.create(data, { transaction: t });
      return kelompok;
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const findAllKelompoks = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const kelompoks = await Kelompok.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
    });

    const { count, rows } = kelompoks;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('kelompok not found'));
    }

    const result = paginate({
      data: rows,
      count,
      page,
      per_page,
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const findOneKelompok = async (id) => {
  try {
    const kelompok = await Kelompok.findOne({
      where: {
        id,
      },
    });

    if (!kelompok) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`kelompok with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: kelompok,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateKelompok = async (id, data) => {
  try {
    const { nama, nomor_kelompok, posisi } = data;
    const kelompok = await findOneKelompok(id);

    if (!kelompok.status) {
      throw kelompok.err;
    }

    const result = await sequelize.transaction(async (t) => {
      kelompok.data.nama = nama;
      kelompok.data.nomor_kelompok = nomor_kelompok;
      kelompok.data.posisi = posisi;

      await kelompok.data.save({ transaction: t });
      return kelompok.data;
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const destroyKelompok = async (id) => {
  try {
    const kelompok = await findOneKelompok(id);

    if (!kelompok.status) {
      throw kelompok.err;
    }

    // delete
    await kelompok.data.destroy();

    return {
      status: true,
      data: kelompok.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveKelompok,
  findAllKelompoks,
  findOneKelompok,
  updateKelompok,
  destroyKelompok,
};
