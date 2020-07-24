const flaverr = require('flaverr');

const { Jenis_Barang, Jenis_Barang_Relasi } = require('../models');

/**
 * Find Jenis Barang Relasis
 * @param {Object} params Params untuk filter data
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (params, pagination = { page: 1, per_page: 20 }) => {
  try {
    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const { count, rows } = await Jenis_Barang_Relasi.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      include: [
        {
          model: Jenis_Barang,
          as: 'Anak',
          attributes: ['id', 'nama', 'kode', 'brand_id'],
        },
        {
          model: Jenis_Barang,
          as: 'Induk',
          attributes: ['id', 'nama', 'kode', 'brand_id'],
        },
      ],
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jenis_barang_relasi not found'));
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

module.exports = { FindMany };
