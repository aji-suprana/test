'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('carts', 'payment_id', { transaction: t }),
        queryInterface.removeColumn('carts', 'delivery_id', { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('carts', 'payment_id', {
          type: Sequelize.DataTypes.UUID
        }, { transaction: t }),
        queryInterface.addColumn('carts', 'delivery_id', {
          type: Sequelize.DataTypes.UUID
        }, { transaction: t }),
      ]);
    });
  }
};
