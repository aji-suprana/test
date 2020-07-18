'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('checkouts', 'delivery_fee', {
          allowNull: true,
          type: Sequelize.DOUBLE
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('checkouts', 'delivery_fee', { transaction: t }),
      ]);
    });
  }
};
