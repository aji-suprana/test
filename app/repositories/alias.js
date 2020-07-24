const flaverr = require('flaverr');
const qs = require('querystring');

const { Alias, Barang, sequelize, Sequelize } = require('../models');

const includeQuery = [
  {
    model: Barang,
    attributes: ['nama_barang'],
  },
];

/**
 *
 * @param {Object} data Data Alias
 * @param {String} data.nama_general Nama Alias
 * @param {Number} data.stok_min Stok Min Alias
 * @returns data containing status and data, or status and error
 */
const Create = async (data = { nama_general, stok_min }) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const alias = await Alias.create(data, { transaction: t });
      return alias;
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
 * Find Aliases
 * @param {Object} params Params untuk filter data
 * @param {String} params.nama_general Nama Alias yang ingin dicari
 * @param {Number} params.stok_min Alias dengan stok_min yang ingin dicari
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = { nama_general, stok_min },
  pagination = { page: 1, per_page: 20 }
) => {
  try {
    const { stok_min } = params;
    const nama_general = params.nama_general
      ? qs.unescape(params.nama_general)
      : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    nama_general
      ? (where.nama_general = { [Sequelize.Op.like]: `%${nama_general}%` })
      : '';

    stok_min ? (where.stok_min = { [Sequelize.Op.eq]: stok_min }) : '';

    const { count, rows } = await Alias.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
      include: includeQuery,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('alias not found'));
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
 * Find an Alias
 * @param {String} id UUID dari Alias
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const alias = await Alias.findOne({
      where: { id },
      include: includeQuery,
    });

    if (!alias) {
      throw flaverr('E_NOT_FOUND', Error(`alias with id ${id} is not found`));
    }

    return {
      status: true,
      data: alias,
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
