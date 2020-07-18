module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER DATABASE ${queryInterface.sequelize.config.database}
        CHARACTER SET utf8 COLLATE utf8_unicode_ci;`
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `ALTER DATABASE ${queryInterface.sequelize.config.database}
        CHARACTER SET latin1 COLLATE latin1_bin;`
    );
  },
};
