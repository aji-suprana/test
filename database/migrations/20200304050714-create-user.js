'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: 'unique_email'
      },
      fb_id: {
        type: Sequelize.STRING,
        unique: 'unique_fb'
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
          fields: ['email']
        },
        unique_fb: {
          customIndex: true,
          fields: ['fb_id']
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};