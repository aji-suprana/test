'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('payments', 'merchant_id', Sequelize.STRING),
        queryInterface.addColumn('payments', 'order_id', Sequelize.STRING),
        queryInterface.addColumn('payments', 'invoice_no', Sequelize.STRING),
        queryInterface.addColumn('payments', 'currency', Sequelize.STRING),
        queryInterface.addColumn('payments', 'amount', Sequelize.DOUBLE),
        queryInterface.addColumn('payments', 'payment_status', Sequelize.STRING),
        queryInterface.addColumn('payments', 'request_timestamp', Sequelize.DATE),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('payments', 'merchant_id', { transaction: t }),
        queryInterface.removeColumn('payments', 'order_id', { transaction: t }),
        queryInterface.removeColumn('payments', 'invoice_no', { transaction: t }),
        queryInterface.removeColumn('payments', 'currency', { transaction: t }),
        queryInterface.removeColumn('payments', 'amount', { transaction: t }),
        queryInterface.removeColumn('payments', 'payment_status', { transaction: t }),
        queryInterface.removeColumn('payments', 'request_timestamp', { transaction: t }),
      ]);
    });
  }
};
