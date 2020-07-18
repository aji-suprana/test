'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('carts', 'cart_status', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('carts', 'cart_status', Sequelize.STRING);
  }
};
