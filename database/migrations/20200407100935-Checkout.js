'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('checkouts', 'promo_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('checkouts', 'promo_id', { transaction: t }),
      ]);
    });
  }
};
