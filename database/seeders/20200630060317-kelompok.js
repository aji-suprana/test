'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Kelompoks', [
      {
        id: '43b1c40c-bf39-11ea-b3de-0242ac130004',
        nama: 'Aktiva',
        nomor_kelompok: '01',
        posisi: 'debit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'd71e5b3b-f5fe-4ad5-9299-fa1c9259babc',
        nama: 'Passiva - Hutang',
        nomor_kelompok: '02',
        posisi: 'kredit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '257b9e38-be69-48df-8694-035116398a45',
        nama: 'Passiva - Modal / Kepemilikan',
        nomor_kelompok: '03',
        posisi: 'kredit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '59d6c78c-be38-4440-89cb-08a8bb17386a',
        nama: 'Pendapatan Penjualan',
        nomor_kelompok: '04',
        posisi: 'kredit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'ca6cf6ad-6839-4593-99ac-0c2d4b0e0576',
        nama: 'HPP',
        nomor_kelompok: '05',
        posisi: 'debit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'd4957c7a-7b22-4eb9-bc91-e895ba137f1f',
        nama: 'Biaya Operasional',
        nomor_kelompok: '06',
        posisi: 'debit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '29017119-a0c6-4220-a873-d6241054c957',
        nama: 'Pendapatan diluar usaha',
        nomor_kelompok: '07',
        posisi: 'kredit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '5ac988fb-c60e-4d0f-ab1f-f4499926b096',
        nama: 'Biaya diluar usaha',
        nomor_kelompok: '08',
        posisi: 'debit',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '514541ad-c673-4092-8a73-e3e4cf5f2aeb',
        nama: 'Biaya pajak',
        nomor_kelompok: '09',
        posisi: 'debit',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Kelompoks', null, {});
  },
};
