'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('user_pages', 'user_fb_id', {
          allowNull: true,
          type: Sequelize.STRING
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('user_pages', 'user_fb_id', { transaction: t }),
      ]);
    });
  }
};
