'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('deliveries', 'cart_id', { transaction: t }),
        queryInterface.removeColumn('deliveries', 'user_id', { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('deliveries', 'cart_id', {
          type: Sequelize.DataTypes.UUID,
        }, { transaction: t }),
        queryInterface.addColumn('deliveries', 'user_id', {
          type: Sequelize.DataTypes.UUID,
        }, { transaction: t }),
      ]);
    });
  },
};
