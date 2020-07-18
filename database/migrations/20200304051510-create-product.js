'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      product_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      product_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT('tiny')
      },
      price: {
        type: Sequelize.DOUBLE
      },
      unit: {
        type: Sequelize.STRING
      },
      product_stock: {
        type: Sequelize.INTEGER
      },
      product_sold: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('products');
  }
};