'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_email: {
        type: Sequelize.STRING,
        unique: 'unique_email'
      },
      access_token: {
        allowNull: false,
        type: Sequelize.TEXT('tiny'),
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
        unique_email: {
          customIndex: true,
          fields: ['user_email']
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tokens');
  }
};