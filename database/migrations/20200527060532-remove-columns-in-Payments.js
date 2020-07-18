'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('payments', 'payment_date', { transaction: t }),
        queryInterface.removeColumn('payments', 'payment_status', { transaction: t }),
        queryInterface.removeColumn('payments', 'bank_name', { transaction: t }),
        queryInterface.removeColumn('payments', 'account_name', { transaction: t }),
        queryInterface.removeColumn('payments', 'account_number', { transaction: t }),
        queryInterface.removeColumn('payments', 'payment_nominal', { transaction: t }),
        queryInterface.removeColumn('payments', 'payment_image', { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('payments', 'payment_date', Sequelize.DATE),
        queryInterface.addColumn('payments', 'payment_status', Sequelize.STRING),
        queryInterface.addColumn('payments', 'bank_name', Sequelize.STRING),
        queryInterface.addColumn('payments', 'account_name', Sequelize.STRING),
        queryInterface.addColumn('payments', 'account_number', Sequelize.STRING),
        queryInterface.addColumn('payments', 'payment_nominal', Sequelize.DOUBLE),
        queryInterface.addColumn('payments', 'payment_image', Sequelize.STRING),

      ]);
    });
  }
};
