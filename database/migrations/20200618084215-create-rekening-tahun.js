'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rekening_Tahuns', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      tahun: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      saldo_awal_tahun: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      sum_tahun: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      next_tahun: {
        type: Sequelize.UUID,
        allowNull: true
      },
      previous_tahun: {
        type: Sequelize.UUID,
        allowNull: true
      },
      rekening_id: {
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
    return queryInterface.dropTable('Rekening_Tahuns');
  },
};
