'use strict';
const uuid = require('uuid').v4;
const kategoriBarang = require('../../app/constants/kategoriBarang');

// tambah date
const data = kategoriBarang.map((item) => {
  item.id = uuid();
  item.created_at = new Date();
  item.updated_at = new Date();
  return item;
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Kategori_Barangs', data);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Kategori_Barangs');
  },
};
