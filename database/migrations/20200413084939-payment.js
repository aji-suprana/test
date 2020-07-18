'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // queryInterface.addColumn('payments', 'session_id', {
        //   allowNull: true,
        //   type: Sequelize.UUID
        // }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        // queryInterface.removeColumn('payments', 'session_id', { transaction: t }),
      ]);
    });
  }
};

