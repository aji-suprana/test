'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("businesses","business_description",Sequelize.TEXT('long'))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("businesses","business_description")
  }
};
