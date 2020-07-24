'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rekening_Bulans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      bulan: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sum_bulan: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      next_bulan: {
        type: Sequelize.UUID,
      },
      previous_bulan: {
        type: Sequelize.UUID,
        allowNull: true
      },
      rekening_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      tahun_id: {
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
    return queryInterface.dropTable('Rekening_Bulans');
  },
};
