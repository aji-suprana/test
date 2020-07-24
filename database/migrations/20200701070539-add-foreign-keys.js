'use strict';
const { addForeignKeys, removeForeignKeys } = require('../utils/foreignKeys');

const tables = [
  {
    table: 'Barang_Suppliers',
    column: ['barang_id'],
    refTable: ['Barangs'],
  },
  {
    table: 'Barangs',
    column: ['kategori_barang_id', 'alias_id', 'satuan_id'],
    refTable: ['Kategori_Barangs', 'Aliases', 'Satuans'],
  },
  {
    table: 'Harga_Juals',
    column: ['barang_id', 'harga_jual_id'],
    refTable: ['Barangs', 'Jenis_Harga_Juals'],
  },
  {
    table: 'Barang_JenisBarangs',
    column: ['jenis_barang_id', 'barang_id'],
    refTable: ['Jenis_Barangs', 'Barangs'],
  },
  {
    table: 'Jenis_Barang_Relasis',
    column: ['induk_id', 'anak_id'],
    refTable: ['Jenis_Barangs', 'Jenis_Barangs'],
  },
  {
    table: 'Barang_Konversis',
    column: ['barang_id', 'konversi_id'],
    refTable: ['Barangs', 'Konversis'],
  },
  {
    table: 'Konversis',
    column: ['satuan_tujuan', 'satuan_asal'],
    refTable: ['Satuans', 'Satuans'],
  },
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(addForeignKeys(queryInterface, Sequelize, tables, t));
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(
        removeForeignKeys(queryInterface, Sequelize, tables, t)
      );
    });
  },
};
