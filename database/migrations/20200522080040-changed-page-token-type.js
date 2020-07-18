'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('pages', 'page_token', {
      allowNull: false,
      type: Sequelize.STRING(1024)
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('pages', 'page_token', {
      allowNull: false,
      type: Sequelize.TEXT
    })
  }
};

