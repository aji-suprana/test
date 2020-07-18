'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('businesses', 'name', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('businesses', 'description_of_products', {
          allowNull: true,
          type: Sequelize.TEXT('tiny')
        }, { transaction: t }),
        queryInterface.addColumn('businesses', 'mobile_number', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('businesses', 'email', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('businesses', 'username', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('businesses', 'password', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('businesses', 'name', { transaction: t }),
        queryInterface.removeColumn('businesses', 'description_of_products', { transaction: t }),
        queryInterface.removeColumn('businesses', 'mobile_number', { transaction: t }),
        queryInterface.removeColumn('businesses', 'email', { transaction: t }),
        queryInterface.removeColumn('businesses', 'username', { transaction: t }),
        queryInterface.removeColumn('businesses', 'password', { transaction: t }),
      ]);
    });
  }
};
