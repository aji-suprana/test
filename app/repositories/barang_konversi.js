const flaverr = require('flaverr');

const { Barang_Konversi } = require('../models');

/**
 * Create Many Barang Konversi
 * @param {Object} data Data
 * @param {String} data.barang_id UUID dari Barang
 * @param {String} data.brand_id UUID dari Brand
 * @param {Array} data.konversi Array data object
 * @param {String} data.konversi.id UUID dari Konversi
 * @param {String} data.konversi.barcode Barcode
 * @param {String} data.konversi.nama_konversi Nama Konversi
 * @param {Object} transaction Object transaction
 */

const CreateMany = async (data, transaction = {}) => {
  try {
    const { konversi, barang_id, brand_id } = data;
    const konversiId = konversi.map((item) => item.id);

    konversiId
      .filter((item, index) => konversiId.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    const barangKonversiData = konversi.map((item) => {
      return {
        nama_konversi:item.nama_konversi,
        barang_id,
        konversi_id: item.id,
        barcode_satuan_lain: item.barcode,
        brand_id,
      };
    });

    const barangKonversi = await Barang_Konversi.bulkCreate(
      barangKonversiData,
      { transaction }
    );

    return {
      status: true,
      data: barangKonversi,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Delete Many Barang Konversi
 * @param {Array} data Array UUID dari Barang Konversi
 * @param {Object} transaction Object transaction
 */

const DeleteMany = async (data, transaction) => {
  try {
    data
      .filter((item, index) => data.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    await Barang_Konversi.destroy({ where: { id: data } }, { transaction });

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
