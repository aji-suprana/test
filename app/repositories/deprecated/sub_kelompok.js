const { Sub_Kelompok, Kelompok, sequelize, Sequelize } = require('../../models');

const flaverr = require('flaverr');

const kelompokRepository = require('./kelompok');

const includeQuery = [
  {
    model: Kelompok,
    attributes: ['nama', 'nomor_kelompok', 'posisi'],
  },
];

const saveSubKelompok = async (data) => {
  try {
    const { kelompok_id } = data;

    const checkKelompok = await kelompokRepository.findOneKelompok(kelompok_id);

    if (!checkKelompok.status) {
      throw checkKelompok.err;
    }

    const result = await sequelize.transaction(async (t) => {
      const subKelompok = await Sub_Kelompok.create(data, { transaction: t });
      return subKelompok;
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

const findAllSubKelompoks = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const subKelompoks = await Sub_Kelompok.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = subKelompoks;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('sub_kelompok not found'));
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

const findOneSubKelompok = async (id) => {
  try {
    const subKelompok = await Sub_Kelompok.findOne({
      where: {
        id,
      },
    });

    if (!subKelompok) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`sub_kelompok with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: subKelompok,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateSubKelompok = async (id, data) => {
  try {
    const { nama, nomor_sub_kelompok } = data;
    const subKelompok = await findOneSubKelompok(id);

    if (!subKelompok.status) {
      throw subKelompok.err;
    }

    const result = await sequelize.transaction(async (t) => {
      subKelompok.data.nama = nama;
      subKelompok.data.nomor_sub_kelompok = nomor_sub_kelompok;

      await subKelompok.data.save({ transaction: t });
      return subKelompok.data;
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

const destroySubKelompok = async (id) => {
  try {
    const subKelompok = await findOneSubKelompok(id);

    if (!subKelompok.status) {
      throw subKelompok.err;
    }

    // delete
    await subKelompok.data.destroy();

    return {
      status: true,
      data: subKelompok.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveSubKelompok,
  findAllSubKelompoks,
  findOneSubKelompok,
  updateSubKelompok,
  destroySubKelompok,
};
