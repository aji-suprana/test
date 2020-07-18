'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('deliveries', 'cart_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('deliveries', 'cart_id', { transaction: t }),
      ]);
    });
  }
};
