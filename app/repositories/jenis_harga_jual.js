const flaverr = require('flaverr');
const qs = require('querystring');

const { Jenis_Harga_Jual, sequelize, Sequelize } = require('../models');

/**
 * Create a Jenis Harga Jual
 * @param {Object} data Data Jenis Harga Jual
 * @param {String} data.nama Nama Jenis Harga Jual
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const CreateOne = async (data = { nama, brand_id }) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const jenisHargaJual = await Jenis_Harga_Jual.create(data, {
        transaction: t,
      });
      return jenisHargaJual;
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
 * Create Many Jenis Harga Juals
 * @param {Object} data Data Jenis Harga Jual
 * @param {Array} data.nama Nama Jenis Harga Jual
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const CreateMany = async (data = { nama, brand_id }) => {
  try {
    const { nama, brand_id } = data;

    const result = await sequelize.transaction(async (t) => {
      const namas = nama.map((namaJenis) => {
        return {
          nama: namaJenis,
          brand_id,
        };
      });

      const jenisHargaJual = await Jenis_Harga_Jual.bulkCreate(namas, {
        transaction: t,
      });
      return jenisHargaJual;
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
 * Find Jenis Harga Juals
 * @param {Object} params Params untuk filter data Jenis Harga Jual
 * @param {String} params.nama Nama Jenis Harga Jual yang ingin dicari
 * @param {Object} pagination Pagination data Jenis Harga Jual
 * @param {Number} pagination.page Halaman data Jenis Harga Jual. Default 1
 * @param {Number} pagination.per_page Data Jenis Harga Jual yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = { nama },
  pagination = { page: 1, per_page: 20 }
) => {
  try {
    const nama = params.nama ? qs.unescape(params.nama) : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    nama ? (where.nama = { [Sequelize.Op.like]: `%${nama}%` }) : '';

    const { count, rows } = await Jenis_Harga_Jual.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jenis_harga_jual not found'));
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
 * Find a Jenis Harga Jual
 * @param {String} id UUID dari Jenis Harga Jual
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const jenisHargaJual = await Jenis_Harga_Jual.findOne({
      where: {
        id,
      },
    });

    if (!jenisHargaJual) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`jenis_harga_jual with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: jenisHargaJual,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  CreateOne,
  CreateMany,
  FindMany,
  FindOne,
};
