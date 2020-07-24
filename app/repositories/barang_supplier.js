const flaverr = require('flaverr');

const { Barang_Supplier } = require('../models');

/**
 * Create Many Barang Supplier
 * @param {Object} data Data
 * @param {String} data.barang_id UUID dari Barang
 * @param {Array} data.supplier_id Array UUID dari Supplier
 * @param {String} data.brand_id UUID dari Brand
 * @param {Object} transaction Object transaction
 */

const CreateMany = async (data, transaction = {}) => {
  try {
    const { supplier_id, barang_id, brand_id } = data;

    supplier_id
      .filter((item, index) => supplier_id.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    const barangSupplierData = supplier_id.map((item) => {
      return { barang_id, supplier_id: item, brand_id };
    });

    const barangSupplier = await Barang_Supplier.bulkCreate(
      barangSupplierData,
      { transaction }
    );

    return {
      status: true,
      data: barangSupplier,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Delete Many Barang Supplier
 * @param {Array} data Array UUID dari Barang Supplier
 * @param {Object} transaction Object transaction
 */

const DeleteMany = async (data, transaction) => {
  try {
    data
      .filter((item, index) => data.indexOf(item) !== index)
      .forEach((item) => {
        throw flaverr('E_BAD_REQUEST', Error(`duplicate input: ${item}`));
      });

    await Barang_Supplier.destroy({ where: { id: data } }, { transaction });

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
