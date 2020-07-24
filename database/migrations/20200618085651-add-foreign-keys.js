'use strict';
const { addForeignKeys, removeForeignKeys } = require('../utils/foreignKeys');

const tables = [
  {
    table: 'Rekenings',
    type: 'STRING',
    column: ['jenis_rekening_id'],
    refTable: ['Jenis_Rekenings'],
  },
  {
    table: 'Jenis_Rekenings',
    type: 'STRING',
    column: ['sub_kelompok_id'],
    refTable: ['Sub_Kelompoks'],
  },
  {
    table: 'Sub_Kelompoks',
    type: 'STRING',
    column: ['kelompok_id'],
    refTable: ['Kelompoks'],
  },
  {
    table: 'Debits',
    column: ['jurnal_umum_id', 'rekening_bulan_id', 'rekening_id'],
    refTable: ['Jurnal_Umums', 'Rekening_Bulans', 'Rekenings'],
  },
  {
    table: 'Credits',
    column: ['jurnal_umum_id', 'rekening_bulan_id', 'rekening_id'],
    refTable: ['Jurnal_Umums', 'Rekening_Bulans', 'Rekenings'],
  },
  {
    table: 'Rekening_Bulans',
    column: ['next_bulan', 'previous_bulan', 'rekening_id', 'tahun_id'],
    refTable: [
      'Rekening_Bulans',
      'Rekening_Bulans',
      'Rekenings',
      'Rekening_Tahuns',
    ],
  },
  {
    table: 'Rekening_Tahuns',
    column: ['next_tahun', 'previous_tahun', 'rekening_id'],
    refTable: ['Rekening_Tahuns', 'Rekening_Tahuns', 'Rekenings'],
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
