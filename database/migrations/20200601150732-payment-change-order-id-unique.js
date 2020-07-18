'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('payments', ['order_id'], {
      type: 'unique',
      name: 'order_id'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('payments', ['order_id'])
  }
};
