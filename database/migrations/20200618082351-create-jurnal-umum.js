'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Jurnal_Umums', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      nomor_invoice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selisih_debet_kredit_total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      modul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brand_id: {
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Jurnal_Umums');
  },
};
