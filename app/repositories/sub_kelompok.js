const flaverr = require('flaverr');

const { Sub_Kelompok, Kelompok } = require('../models');

const includeQuery = [
  {
    model: Kelompok,
    attributes: ['nama', 'nomor_kelompok', 'posisi'],
  },
];

const FindMany = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const { count, rows } = await Sub_Kelompok.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

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

const FindOne = async (id) => {
  try {
    const subKelompok = await Sub_Kelompok.findOne({
      where: {
        id,
      },
      include: includeQuery,
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

module.exports = {
  FindMany,
  FindOne,
};
