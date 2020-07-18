'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('businesses', 'business_address', {
          allowNull: true,
          type: Sequelize.TEXT('tiny')
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('businesses', 'business_address', { transaction: t }),
      ]);
    });
  }
};
