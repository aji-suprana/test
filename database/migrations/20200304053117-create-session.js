'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sessions', {
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
      session_code: {
        type: Sequelize.STRING
      },
      session_name: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('sessions');
  }
};