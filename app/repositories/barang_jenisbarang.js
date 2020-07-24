const flaverr = require('flaverr');

const { Barang_JenisBarang } = require('../models');

const jenisBarangRepository = require('./jenis_barang');

const checkRootParent = async (id) => {
  try {
    const parent = await jenisBarangRepository.FindOne(id);

    if (!parent.status) {
      throw parent.err;
    }

    if (parent.data.Induk.length) {
      const rootParent = await checkRootParent(parent.data.Induk[0].induk_id);
      return rootParent;
    }

    return parent.data.id;
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Create Many Barang Jenis Barang
 * @param {Object} data Data
 * @param {String} data.barang_id UUID dari Barang
 * @param {Array} data.jenis_barang_id Array UUID dari Jenis Barang
 * @param {String} data.brand_id UUID dari Brand
 * @param {Object} transaction Object transaction
 */

const CreateMany = async (data, transaction = {}) => {
  try {
    const { jenis_barang_id, barang_id, brand_id } = data;

    jenis_barang_id
      .filter((item, index) => jenis_barang_id.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    // cek root parent dari jenis_barang
    const rootParents = await Promise.all(
      jenis_barang_id.map(async (item) => {
        return await checkRootParent(item);
      })
    );

    // filter only duplicate
    rootParents
      .filter((item, index) => rootParents.indexOf(item) !== index)
      .forEach((item) => {
        {
          throw flaverr(
            'E_BAD_REQUEST',
            Error(`jenis_barang have the same induk_id: ${item}`)
          );
        }
      });

    const barangJenisBarangData = jenis_barang_id.map((item) => {
      return { barang_id, jenis_barang_id: item, brand_id };
    });

    const barangJenisBarang = await Barang_JenisBarang.bulkCreate(
      barangJenisBarangData,
      { transaction }
    );

    return {
      status: true,
      data: barangJenisBarang,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Delete Many Barang Jenis Barang
 * @param {Array} data Array UUID dari Barang Jenis Barang
 * @param {Object} transaction Object transaction
 */

const DeleteMany = async (data, transaction) => {
  try {
    data
      .filter((item, index) => data.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    await Barang_JenisBarang.destroy({ where: { id: data } }, { transaction });

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

module.exports = { CreateMany, DeleteMany };
