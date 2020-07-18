'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('carts', 'expiry_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('carts', 'expiry_date');
  },
};
