'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'businesses',
      'contact_link',
      Sequelize.TEXT
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('businesses', 'contact_link');
  },
};
