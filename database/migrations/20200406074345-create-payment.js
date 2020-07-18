'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      payment_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      payment_status: {
        allowNull: false,
        type: Sequelize.STRING,
        default: "Not Process"
      },
      bank_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      account_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      account_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      payment_nominal: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        default: 0.0
      },
      payment_image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payments');
  }
};