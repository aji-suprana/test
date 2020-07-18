'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('carts', 'name', Sequelize.STRING)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('carts', 'name')
  }
};