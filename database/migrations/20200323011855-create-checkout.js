'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('checkouts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      checkout_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      delivery_id: {
        allowNull: true,
        type: Sequelize.UUID
      },
      cart_id: {
        allowNull: false,
        type: Sequelize.UUID
      },
      purchase_amount: {
        allowNull: false,
        type: Sequelize.DOUBLE,
        default: 0.0
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        default: "ordered"
      },
      buyer_id: {
        type: Sequelize.UUID,
        required: true
      },
      buyer_fb_id: {
        type: Sequelize.STRING,
        required: true
      },
      buyer_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_region: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_zip_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyer_phone: {
        allowNull: false,
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
    }, {
      uniqueKeys: {
        unique_checkout_code: {
          customIndex: true,
          fields: ['checkout_code']
        }
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Checkouts');
  }
};