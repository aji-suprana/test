const flaverr = require('flaverr');

const {
  Harga_Jual,
  Jenis_Harga_Jual,
  sequelize,
  Sequelize,
} = require('../models');

const includeQuery = [
  {
    model: Jenis_Harga_Jual,
    attributes: ['nama'],
  },
];

/**
 * Create a Harga Jual
 * @param {Object} data Data
 * @param {String} data.barang_id UUID dari Barang
 * @param {Number} data.qty_min Quantity Minimum
 * @param {String} data.harga_jual Harga Jual
 * @param {String} data.harga_jual_id UUID dari Jenis Harga Jual
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const Create = async (
  data = {
    barang_id,
    qty_min,
    harga_jual,
    harga_jual_id,
    brand_id,
  }
) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const hargaJual = await Harga_Jual.create(data, { transaction: t });
      return hargaJual;
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
 * Create Many Harga Jual
 * @param {Object} data Data
 * @param {String} data.barang_id UUID dari Barang
 * @param {String} data.brand_id UUID dari Brand
 * @param {Array} data.harga_jual Array data object
 * @param {String} data.harga_jual.id UUID dari Jenis Harga Jual
 * @param {String} data.harga_jual.qty_min Quantity Minimum
 * @param {String} data.harga_jual.harga_jual Harga Jual
 * @param {Object} transaction Object transaction
 */

const CreateMany = async (data, transaction = {}) => {
  try {
    const { harga_jual, barang_id, brand_id } = data;
    const hargaJualId = harga_jual.map((item) => item.id);

    hargaJualId
      .filter((item, index) => hargaJualId.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    const hargaJualData = harga_jual.map((item) => {
      return {
        barang_id,
        qty_min: item.qty_min,
        harga_jual: item.harga_jual,
        harga_jual_id: item.id,
        brand_id,
      };
    });

    const hargaJual = await Harga_Jual.bulkCreate(hargaJualData, {
      transaction,
    });

    return {
      status: true,
      data: hargaJual,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Find Harga Jual
 * @param {Object} params Params untuk filter data
 * @param {String} params.barang_id UUID dari Barang
 * @param {String} params.qty_min Quantity Minimum
 * @param {String} params.harga_jual Harga Jual
 * @param {String} params.harga_jual_id UUID dari Jenis Harga Jual
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = {
    barang_id,
    qty_min,
    harga_jual,
    harga_jual_id,
  },
  pagination = {
    page: 1,
    per_page: 20,
  }
) => {
  try {
    const { barang_id, qty_min, harga_jual, harga_jual_id } = params;
    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    barang_id ? (where.barang_id = { [Sequelize.Op.eq]: barang_id }) : '';
    qty_min ? (where.qty_min = { [Sequelize.Op.eq]: qty_min }) : '';
    harga_jual ? (where.harga_jual = { [Sequelize.Op.eq]: harga_jual }) : '';
    harga_jual_id
      ? (where.harga_jual_id = { [Sequelize.Op.eq]: harga_jual_id })
      : '';

    const { count, rows } = await Harga_Jual.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
      include: includeQuery,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('harga_jual not found'));
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
 * Find a Harga_Jual
 * @param {String} id UUID dari Harga Jual
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const hargaJual = await Harga_Jual.findOne({
      where: { id },
      include: includeQuery,
    });

    if (!hargaJual) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`harga_jual with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: hargaJual,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Delete Many Harga Jual
 * @param {Array} data Array UUID dari Harga Jual
 * @param {Object} transaction Object transaction
 */

const DeleteMany = async (data, transaction) => {
  try {
    data
      .filter((item, index) => data.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    await Harga_Jual.destroy({ where: { id: data } }, { transaction });

    return {
      status: true,
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
  CreateMany,
  FindMany,
  FindOne,
  DeleteMany,
};
