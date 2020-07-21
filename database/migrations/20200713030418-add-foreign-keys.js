'use strict';
const { addForeignKeys, removeForeignKeys } = require('../utils/foreignKeys');

const tables = [
  {
    table: 'EmailVerifications',
    column: ['user_id'],
    refTable: ['Users'],
  },
  {
    table: 'Profiles',
    column: ['user_id'],
    refTable: ['Users'],
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(addForeignKeys(queryInterface, Sequelize, tables, t));
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all(removeForeignKeys(queryInterface, tables, t));
    });
  },
};
