'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('businesses', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      business_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      business_description: {
        type: Sequelize.TEXT('tiny')
      },
      streaming_estimate: {
        type: Sequelize.DOUBLE
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID
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
    return queryInterface.dropTable('businesses');
  }
};