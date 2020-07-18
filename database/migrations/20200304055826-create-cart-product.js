'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cart_products', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      cart_id: {
        type: Sequelize.UUID
      },
      product_id: {
        type: Sequelize.UUID
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable('cart_products');
  }
};