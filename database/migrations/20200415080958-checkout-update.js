'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('checkouts', 'session_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
        queryInterface.addColumn('checkouts', 'user_id', {
          allowNull: true,
          type: Sequelize.UUID
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('checkouts', 'session_id', { transaction: t }),
        queryInterface.removeColumn('checkouts', 'user_id', { transaction: t }),
      ]);
    });
  }
};
