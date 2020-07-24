const flaverr = require('flaverr');

const { Konversi, Satuan, sequelize, Sequelize } = require('../models');

const includeQuery = [
  {
    model: Satuan,
    as: 'SatuanTujuan',
    attributes: ['nama_satuan'],
  },
  {
    model: Satuan,
    as: 'SatuanAsal',
    attributes: ['nama_satuan'],
  },
];

/**
 * Create a Konversi
 * @param {Object} data Data Konversi
 * @param {String} data.satuan_tujuan UUID dari Satuan untuk Satuan Tujuan
 * @param {String} data.satuan_asal UUID dari Satuan untuk Satuan Asal
 * @param {Number} data.conversion_rate Nilai Konversi untuk Satuan
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const Create = async (data) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const konversi = await Konversi.create(data, { transaction: t });
      return konversi;
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

/**
 * Find Konversis
 * @param {Object} params Params untuk filter data Konversi
 * @param {String} params.satuan_tujuan UUID dari Satuan
 * @param {String} params.satuan_asal UUID dari Satuan
 * @param {Object} pagination Pagination data Konversi
 * @param {Number} pagination.page Halaman data Konversi. Default 1
 * @param {Number} pagination.per_page Data Konversi yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params,
  pagination = {
    page: 1,
    per_page: 20,
  }
) => {
  try {
    const { satuan_tujuan, satuan_asal } = params;
    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    satuan_tujuan
      ? (where.satuan_tujuan = { [Sequelize.Op.eq]: satuan_tujuan })
      : '';

    satuan_asal ? (where.satuan_asal = { [Sequelize.Op.eq]: satuan_asal }) : '';

    const { count, rows } = await Konversi.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
      include: includeQuery,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('konversi not found'));
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

/**
 * Find a Konversi
 * @param {String} id UUID dari Konversi
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const konversi = await Konversi.findOne({
      where: { id },
      include: includeQuery,
    });

    if (!konversi) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`konversi with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: konversi,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  Create,
  FindMany,
  FindOne,
};
