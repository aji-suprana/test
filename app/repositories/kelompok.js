const flaverr = require('flaverr');

const { Kelompok } = require('../models');

const FindMany = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const { count, rows } = await Kelompok.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
    });

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

const FindOne = async (id) => {
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

module.exports = {
  FindMany,
  FindOne,
};
