const flaverr = require('flaverr');
const qs = require('querystring');

const { Kategori_Barang, Sequelize } = require('../models');

/**
 * Find Kategori Barangs
 * @param {Object} params Params untuk filter data
 * @param {String} params.nama Nama yang ingin dicari
 * @param {String} params.kode Kode yang ingin dicari
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = { nama: '', kode: '' },
  pagination = { page: 1, per_page: 20 }
) => {
  try {
    const nama = params.nama ? qs.unescape(params.nama) : '';
    const kode = params.kode ? qs.unescape(params.kode) : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    nama ? (where.nama = { [Sequelize.Op.like]: `%${nama}%` }) : '';
    kode ? (where.kode = { [Sequelize.Op.like]: `%${kode}%` }) : '';

    const { count, rows } = await Kategori_Barang.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('kategori_barang not found'));
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
 * Find a Kategori Barang
 * @param {String} id UUID dari Kategori Barang
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const kategoriBarang = await Kategori_Barang.findOne({
      where: {
        id,
      },
    });

    if (!kategoriBarang) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`kategori_barang with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: kategoriBarang,
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
