'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      'ALTER TABLE tags ADD COLUMN user_id CHAR(36) after cart_id'
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tags', 'user_id');
  },
};
