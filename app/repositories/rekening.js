const flaverr = require('flaverr');

const { Rekening, Jenis_Rekening, sequelize, Sequelize } = require('../models');
const jenisRekeningRepository = require('./jenis_rekening');

const includeQuery = [
  {
    model: Jenis_Rekening,
    attributes: ['nama', 'nomor_jenis_rekening', 'sub_kelompok_id'],
  },
];

/**
 * Create Rekening
 * @param {Object} data Data Rekening
 * @param {String} data.nama Nama Rekening
 * @param {String} data.nomor_rekening Nomor Rekening
 * @param {String} data.jenis_rekening_id ID dari Jenis Rekening
 * @param {String} data.brand_id UUID dari Brand
 * @param {Boolean} data.is_default Boolean
 * @returns data containing status and data, or status and error
 */

const Create = async (
  data = {
    nama,
    nomor_rekening,
    jenis_rekening_id,
    brand_id,
    is_default,
  }
) => {
  try {
    const { jenis_rekening_id } = data;

    const checkJenisRekening = await jenisRekeningRepository.FindOne(
      jenis_rekening_id
    );

    if (!checkJenisRekening.status) {
      throw checkJenisRekening.err;
    }

    // create
    const result = await Rekening.create(data);

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
 * Find Rekenings
 * @param {Object} params Params untuk filter data
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default: 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default: 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = {},
  pagination = {
    page: 1,
    per_page: 20,
  }
) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const { count, rows } = await Rekening.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('rekening not found'));
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
 * Find a Rekening
 * @param {String} id UUID dari Rekening
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const rekening = await Rekening.findOne({
      where: {
        id,
      },
      include: includeQuery,
    });

    if (!rekening) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`rekening with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: rekening,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Update a Rekening
 * @param {String} id UUID dari Rekening
 * @param {Object} data Data Rekening
 * @param {String} data.nama Nama Baru Rekening
 * @param {String} data.nomor_rekening Nomor Rekening Baru
 * @returns data containing status and data, or status and error
 */

const Update = async (
  id,
  data = {
    nama,
    nomor_rekening,
  }
) => {
  try {
    const { nama, nomor_rekening } = data;
    const rekening = await FindOne(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    const result = await sequelize.transaction(async (t) => {
      rekening.data.nama = nama;
      rekening.data.nomor_rekening = nomor_rekening;

      await rekening.data.save({ transaction: t });
      return rekening.data;
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
 * Delete a Rekening
 * @param {String} id UUID dari Rekening
 * @returns data containing status and data, or status and error
 */

const Delete = async (id) => {
  try {
    const rekening = await FindOne(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    // delete
    await rekening.data.destroy();

    return {
      status: true,
      data: rekening.data,
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
  Update,
  Delete,
};
