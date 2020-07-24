const flaverr = require('flaverr');
const qs = require('querystring');

const {
  Jenis_Barang,
  Jenis_Barang_Relasi,
  sequelize,
  Sequelize,
} = require('../models');

const includeQuery = [
  {
    model: Jenis_Barang_Relasi,
    as: 'Anak',
    attributes: ['id', 'anak_id'],
  },
  {
    model: Jenis_Barang_Relasi,
    as: 'Induk',
    attributes: ['id', 'induk_id'],
  },
];

/**
 * Create Jenis Barang
 * @param {Object} data Data Jenis Barang
 * @param {String} data.nama Nama Jenis Barang
 * @param {String} data.kode Kode Jenis Barang
 * @param {String} data.jenis_barang_id UUID dari Jenis Barang untuk relasi
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const Create = async (
  data = {
    nama,
    kode,
    jenis_barang_id,
    brand_id,
  }
) => {
  try {
    const { nama, kode, jenis_barang_id, brand_id } = data;
    const jenisBarangData = { nama, kode, brand_id };

    const result = await sequelize.transaction(async (t) => {
      const jenisBarang = await Jenis_Barang.create(jenisBarangData, {
        transaction: t,
      });

      const relasiData = {
        anak_id: jenisBarang.id,
        brand_id,
      };

      // jika jenis barang ada relasi dengan jenis barang yg lainnya
      if (jenis_barang_id) {
        relasiData.induk_id = jenis_barang_id;
      }

      await Jenis_Barang_Relasi.create(relasiData, { transaction: t });
      return jenisBarang;
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
 * Find Jenis Barangs
 * @param {Object} params Params untuk filter data
 * @param {String} params.nama Nama
 * @param {String} params.kode Kode
 * @param {String} params.brand_id UUID dari Brand
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = {
    nama,
    kode,
    brand_id,
  },
  pagination = {
    page: 1,
    per_page: 20,
  }
) => {
  try {
    const { brand_id } = params;
    const nama = params.nama ? qs.unescape(params.nama) : '';
    const kode = params.kode ? qs.unescape(params.kode) : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    nama ? (where.nama = { [Sequelize.Op.like]: `%${nama}%` }) : '';
    kode ? (where.kode = { [Sequelize.Op.like]: `%${kode}%` }) : '';
    brand_id ? (where.brand_id = { [Sequelize.Op.eq]: brand_id }) : '';

    const { count, rows } = await Jenis_Barang.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
      include: includeQuery,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jenis_barang not found'));
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
 * Find Jenis Barang Parents
 * @param {Object} params Params untuk filter data
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindAllParent = async (
  params,
  pagination = { page: 1, per_page: 20 }
) => {
  try {
    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const parentInclude = [
      {
        model: Jenis_Barang_Relasi,
        as: 'Anak',
        attributes: ['id', 'anak_id'],
      },
      {
        model: Jenis_Barang_Relasi,
        as: 'Induk',
        attributes: ['id', 'induk_id'],
        where: {
          induk_id: null,
        },
      },
    ];

    const { count, rows } = await Jenis_Barang.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      include: parentInclude,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jenis_barang_parent not found'));
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
 * Find a Jenis Barang
 * @param {String} id UUID dari Jenis Barang
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const jenisBarang = await Jenis_Barang.findOne({
      where: { id },
      include: includeQuery,
    });

    if (!jenisBarang) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`jenis_barang with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: jenisBarang,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Update Jenis Barang
 * @param {String} id UUID dari Jenis Barang
 * @param {Object} data Data Jenis Barang
 * @param {String} data.nama Nama Jenis Barang
 * @param {String} data.kode Kode Jenis Barang
 * @param {String} data.jenis_barang_id UUID dari Jenis Barang untuk relasi
 * @returns data containing status and data, or status and error
 */

const Update = async (
  id,
  data = {
    nama,
    kode,
    jenis_barang_id,
  }
) => {
  try {
    const { nama, kode, jenis_barang_id } = data;

    const jenisBarang = await FindOne(id);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    const result = await sequelize.transaction(async (t) => {
      jenisBarang.data.nama = nama;
      jenisBarang.data.kode = kode;

      // jika jenis barang ada relasi dengan jenis barang yg lainnya
      if (jenis_barang_id) {
        const currentInduk = jenisBarang.data.Induk;

        if (!currentInduk.length) {
          await Jenis_Barang_Relasi.create({
            anak_id: id,
            induk_id: jenis_barang_id,
          });
        } else {
          const induk = await Jenis_Barang_Relasi.findOne({
            where: {
              induk_id: currentInduk[0].induk_id,
              anak_id: id,
            },
          });

          induk.induk_id = jenis_barang_id;
          await induk.save({ transaction: t });
        }
      }

      await jenisBarang.data.save({ transaction: t });
      return jenisBarang.data;
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

const Delete = async (id) => {
  try {
    const jenisBarang = await FindOne(id);

    if (!jenisBarang.status) {
      throw jenisBarang.err;
    }

    const result = await sequelize.transaction(async (t) => {
      const anaks = jenisBarang.data.Anak.map((item) => item.id);
      const induks = jenisBarang.data.Induk.map((item) => item.id);

      await Jenis_Barang_Relasi.destroy(
        { where: { id: anaks } },
        { transaction: t }
      );

      await Jenis_Barang_Relasi.destroy(
        { where: { id: induks } },
        { transaction: t }
      );

      await jenisBarang.data.destroy({ transaction: t });
      return jenisBarang.data;
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

module.exports = {
  Create,
  FindMany,
  FindAllParent,
  FindOne,
  Update,
  Delete,
};
