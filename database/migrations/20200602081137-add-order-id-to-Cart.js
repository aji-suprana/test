'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('carts', 'order_id', Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('carts', 'order_id');
  },
};
