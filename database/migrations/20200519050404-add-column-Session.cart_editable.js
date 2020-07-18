'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'sessions',
      'cart_editable',
      Sequelize.BOOLEAN
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sessions', 'cart_editable');
  },
};
