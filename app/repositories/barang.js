const flaverr = require('flaverr');
const qs = require('querystring');

const {
  Barang,
  Kategori_Barang,
  Alias,
  Barang_Konversi,
  Barang_JenisBarang,
  Barang_Supplier,
  Harga_Jual,
  Satuan,
  sequelize,
  Sequelize,
} = require('../models');

const includeQuery = [
  {
    model: Alias,
    attributes: ['nama_general', 'stok_min'],
  },
  {
    model: Barang_Supplier,
    attributes: ['id', 'supplier_id'],
  },
  {
    model: Barang_Konversi,
    attributes: ['id', 'konversi_id', 'barcode_satuan_lain'],
  },
  {
    model: Barang_JenisBarang,
    attributes: ['id', 'jenis_barang_id'],
  },
  {
    model: Harga_Jual,
    attributes: ['id', 'qty_min', 'harga_jual', 'harga_jual_id'],
  },
  {
    model: Kategori_Barang,
    attributes: ['nama', 'kode'],
  },
  {
    model: Satuan,
    attributes: ['nama_satuan'],
  },
];

/**
 * Create a Barang
 * @param {Object} data Data
 * @param {String} data.nama_barang Nama
 * @param {String} data.kode_barang Kode
 * @param {String} data.satuan_id UUID dari Satuan
 * @param {String} data.kategori_barang_id UUID dari Kategori Barang
 * @param {String} data.tipe_barang Tipe Barang [stock, non-stock]
 * @param {String} data.alias_id UUID dari Alias
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const CreateOne = async (data, transaction) => {
  try {
    const {
      nama_barang,
      kode_barang,
      satuan_id,
      tipe_barang,
      kategori_barang_id,
      alias_id,
      brand_id,
    } = data;

    // TODO: check rekening persediaan
    const checkRekeningPersediaan = {};

    // TODO: check rekening hpp
    const checkRekeningHpp = {};

    const barangData = {
      nama_barang,
      kode_barang,
      satuan_id,
      kategori_barang_id,
      tipe_barang,
      alias_id,
      brand_id,
    };

    const barang = await Barang.create(barangData, { transaction });

    return {
      status: true,
      data: barang,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Find Barangs
 * @param {Object} params Params untuk filter data Barang
 * @param {String} params.nama_barang Nama Barang
 * @param {String} params.jenis_barang_id UUID dari Jenis Barang
 * @param {Number} params.harga_jual Nominal Harga Jual
 * @param {Number} params.stok_min Stok Minimum Alias
 * @param {String} params.supplier_id UUID dari Supplier
 * @param {String} params.kategori_barang_id UUID dari Kategori Barang
 * @param {Object} pagination Pagination data Barang
 * @param {Number} pagination.page Halaman data Barang. Default 1
 * @param {Number} pagination.per_page Data Barang yang ditampilkan per halaman. Default 20
 * @returns data containing status and data, or status and error
 */

const FindMany = async (
  params = {
    nama_barang,
    jenis_barang_id,
    harga_jual,
    stok_min,
    supplier_id,
    kategori_barang_id,
  },
  pagination = {
    page: 1,
    per_page: 20,
  }
) => {
  try {
    const {
      jenis_barang_id,
      harga_jual,
      stok_min,
      supplier_id,
      kategori_barang_id,
    } = params;

    const nama_barang = params.nama_barang
      ? qs.unescape(params.nama_barang)
      : '';

    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    // pencarian barang
    const where = {};
    nama_barang
      ? (where.nama_barang = { [Sequelize.Op.like]: `%${nama_barang}%` })
      : '';
    kategori_barang_id
      ? (where.kategori_barang_id = { [Sequelize.Op.eq]: kategori_barang_id })
      : '';

    const barangInclude = [
      {
        model: Alias,
        attributes: ['nama_general', 'stok_min'],
      },
      {
        model: Barang_Supplier,
        attributes: ['id', 'supplier_id'],
      },
      {
        model: Barang_Konversi,
        attributes: ['id', 'konversi_id', 'barcode_satuan_lain'],
      },
      {
        model: Barang_JenisBarang,
        attributes: ['id', 'jenis_barang_id'],
      },
      {
        model: Harga_Jual,
        attributes: ['id', 'qty_min', 'harga_jual', 'harga_jual_id'],
      },
      {
        model: Kategori_Barang,
        attributes: ['nama', 'kode'],
      },
      {
        model: Satuan,
        attributes: ['nama_satuan'],
      },
    ];

    barangInclude.map((item) => {
      item.where = {};

      if (item.model === Alias) {
        if (stok_min) {
          item.where.stok_min = { [Sequelize.Op.eq]: stok_min };
        }
      }

      if (item.model === Barang_Supplier) {
        if (supplier_id) {
          item.where.supplier_id = { [Sequelize.Op.eq]: supplier_id };
        }
      }

      if (item.model === Barang_JenisBarang) {
        if (jenis_barang_id) {
          item.where.jenis_barang_id = { [Sequelize.Op.eq]: jenis_barang_id };
        }
      }

      if (item.model === Harga_Jual) {
        if (harga_jual) {
          item.where.harga_jual = { [Sequelize.Op.eq]: harga_jual };
        }
      }
    });

    const { count, rows } = await Barang.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
      include: barangInclude,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('barang not found'));
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
 * Find a Barang
 * @param {String} id UUID dari Barang
 * @returns data containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const barang = await Barang.findOne({
      where: { id },
      include: includeQuery,
    });

    if (!barang) {
      throw flaverr('E_NOT_FOUND', Error(`barang with id ${id} is not found`));
    }

    return {
      status: true,
      data: barang,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Update a Barang
 * @param {String} id UUID dari Barang
 * @param {Object} data Data
 * @param {String} data.nama_barang Nama
 * @param {String} data.kode_barang Kode
 * @param {String} data.satuan_id UUID dari Satuan
 * @param {String} data.kategori_barang_id UUID dari Kategori Barang
 * @param {String} data.tipe_barang Tipe Barang [stock, non-stock]
 * @param {String} data.alias_id UUID dari Alias
 * @param {String} data.brand_id UUID dari Brand
 * @returns data containing status and data, or status and error
 */

const UpdateOne = async (id, data, transaction) => {
  try {
    const {
      nama_barang,
      kode_barang,
      satuan_id,
      tipe_barang,
      kategori_barang_id,
      alias_id,
    } = data;

    // check barang
    const barang = await FindOne(id);

    if (!barang.status) {
      throw barang.err;
    }

    // TODO: check rekening persediaan
    const checkRekeningPersediaan = {};

    // TODO: check rekening hpp
    const checkRekeningHpp = {};

    barang.data.nama_barang = nama_barang;
    barang.data.kode_barang = kode_barang;
    barang.data.satuan_id = satuan_id;
    barang.data.tipe_barang = tipe_barang;
    barang.data.alias_id = alias_id;
    barang.data.kategori_barang_id = kategori_barang_id;

    await barang.data.save({ transaction });

    return {
      status: true,
      data: barang.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Delete a Barang
 * @param {String} id UUID dari Barang
 * @returns data containing status and data, or status and error
 */

const DeleteOne = async (id) => {
  try {
    const barang = await FindOne(id);

    if (!barang.status) {
      throw barang.err;
    }

    const barang_id = id;

    const result = await sequelize.transaction(async (t) => {
      await Barang_Supplier.destroy(
        { where: { barang_id } },
        { transaction: t }
      );

      await Harga_Jual.destroy({ where: { barang_id } }, { transaction: t });
      await Barang_JenisBarang.destroy(
        { where: { barang_id } },
        { transaction: t }
      );
      await Barang_Konversi.destroy(
        { where: { barang_id } },
        { transaction: t }
      );

      await barang.data.destroy({ transaction: t });
      return barang.data;
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
  CreateOne,
  FindMany,
  FindOne,
  UpdateOne,
  DeleteOne,
};
