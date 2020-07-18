'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('promos', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      promo_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      promo_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      promo_discount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      max_discount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      min_ammount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      description: {
        type: Sequelize.TEXT('tiny')
      },
      expired_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      is_expired: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('promos');
  }
};