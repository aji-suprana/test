'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Harga_Juals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      barang_id: {
        type: Sequelize.UUID,
      },
      qty_min: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      harga_jual: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      harga_jual_id: {
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
    return queryInterface.dropTable('Harga_Juals');
  },
};
