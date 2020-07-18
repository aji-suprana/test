'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('payments', 'cart_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('payments', 'cart_id', { transaction: t }),
      ]);
    });
  }
};
