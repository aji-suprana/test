'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('carts', 'payment_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
        queryInterface.addColumn('carts', 'delivery_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('carts', 'payment_id', { transaction: t }),
        queryInterface.removeColumn('carts', 'delivery_id', { transaction: t }),
      ]);
    });
  }
};
