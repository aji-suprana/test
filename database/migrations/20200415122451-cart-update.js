'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('carts', 'buyer_recipient_id', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('carts', 'page_id', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('carts', 'buyer_recipient_id', { transaction: t }),
        // queryInterface.removeColumn('carts', 'seller_recepient_id', { transaction: t }),
        queryInterface.removeColumn('carts', 'page_id', { transaction: t }),
      ]);
    });
  }
};
