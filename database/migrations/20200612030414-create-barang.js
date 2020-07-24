'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Barangs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      nama_barang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kode_barang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      satuan_id: {
        type: Sequelize.UUID,
      },
      tipe_barang: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kategori_barang_id: {
        type: Sequelize.UUID,
      },
      rekening_persediaan: {
        type: Sequelize.UUID,
      },
      rekening_hpp: {
        type: Sequelize.UUID,
      },
      alias_id: {
        type: Sequelize.UUID,
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
    return queryInterface.dropTable('Barangs');
  },
};
