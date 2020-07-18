'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('carts', 'seller_recipient_id', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('carts', 'seller_recipient_id', { transaction: t }),
      ]);
    });
  }
};
