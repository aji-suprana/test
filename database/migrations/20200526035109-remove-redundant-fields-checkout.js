'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('checkouts', 'payment_id', { transaction: t }),
        queryInterface.removeColumn('checkouts', 'delivery_id', { transaction: t }),
        queryInterface.removeColumn('checkouts', 'status', { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('checkouts', 'payment_id', {
          type: Sequelize.DataTypes.UUID
        }, { transaction: t }),
        queryInterface.addColumn('checkouts', 'delivery_id', {
          type: Sequelize.DataTypes.UUID
        }, { transaction: t }),
        queryInterface.addColumn('checkouts', 'status', {
          type: Sequelize.DataTypes.STRING,
          defaultValue: 'ordered'
        }, { transaction: t }),
      ]);
    });
  }
};
