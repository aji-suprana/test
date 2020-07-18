'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('deliveries', 'delivery_time', {
          allowNull: true,
          type: Sequelize.DOUBLE
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('deliveries', 'delivery_time', { transaction: t }),
      ]);
    });
  }
};
