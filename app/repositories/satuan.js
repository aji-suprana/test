const flaverr = require('flaverr');
const qs = require('querystring');

const { Satuan, sequelize, Sequelize } = require('../models');

/**
 * Create One Satuan
 * @param {Object} data Data Satuan
 * @param {String} data.nama_satuan Nama Satuan
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const CreateOne = async (data = { nama_satuan, brand_id }) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const satuan = await Satuan.create(data, { transaction: t });
      return satuan;
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
 * Create Many Satuan
 * @param {Object} data Data Satuan
 * @param {Array} data.nama_satuan Nama Satuan
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const CreateMany = async (data = { nama_satuan, brand_id }) => {
  try {
    const { nama_satuan, brand_id } = data;

    const result = await sequelize.transaction(async (t) => {
      const namas = nama_satuan.map((nama) => {
        return {
          nama_satuan: nama,
          brand_id,
        };
      });

      const satuans = await Satuan.bulkCreate(namas, { transaction: t });
      return satuans;
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
 * Find Satuans
 * @param {Object} params Params untuk filter data
 * @param {String} params.nama_satuan Nama yang ingin dicari
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = { nama_satuan },
  pagination = { page: 1, per_page: 20 }
) => {
  try {
    const nama_satuan = params.nama_satuan
      ? qs.unescape(params.nama_satuan)
      : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    nama_satuan
      ? (where.nama_satuan = { [Sequelize.Op.like]: `%${nama_satuan}%` })
      : '';

    const { count, rows } = await Satuan.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('satuan not found'));
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
 * Find a Satuan
 * @param {String} id UUID dari Satuan
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const satuan = await Satuan.findOne({
      where: {
        id,
      },
    });

    if (!satuan) {
      throw flaverr('E_NOT_FOUND', Error(`satuan with id ${id} is not found`));
    }

    return {
      status: true,
      data: satuan,
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
