'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('checkouts', 'checkout_code')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('checkouts', 'checkout_code', {
      type: Sequelize.STRING,
      allowNull: false,
      required: true,
      unique: {
        args: true,
        msg: 'Checkout code already in use!'
      }
    })
  }
};
