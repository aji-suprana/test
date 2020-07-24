'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Jenis_Rekenings', [
       {
          id: '0a2de9f1-5df8-4a96-aa07-8427981fd339',
          nama: 'Kas Besar',
          nomor_jenis_rekening: '0101001',
          sub_kelompok_id: '8c9d2b11-420b-4a96-aba8-cbfb9c8e9c85',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6ebe4218-52fa-481e-af67-2219fb55ab95',
          nama: 'Kas Kecil',
          nomor_jenis_rekening: '0101002',
          sub_kelompok_id: '8c9d2b11-420b-4a96-aba8-cbfb9c8e9c85',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'a53e01b9-20e0-49c6-8b4b-7ccbc3b67873',
          nama: 'Bank',
          nomor_jenis_rekening: '0101003',
          sub_kelompok_id: '8c9d2b11-420b-4a96-aba8-cbfb9c8e9c85',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'a7ab538d-3699-4506-980a-003837adc15e',
          nama: 'Piutang Dagang',
          nomor_jenis_rekening: '0102001',
          sub_kelompok_id: '4adc76be-2da0-47a9-8f75-9523364c456b',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b31b972f-646c-4938-941f-13088e4bd04f',
          nama: 'Piutang Cek / BG',
          nomor_jenis_rekening: '0102002',
          sub_kelompok_id: '4adc76be-2da0-47a9-8f75-9523364c456b',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'c61b800a-07b8-4b85-a90a-b771cef6cd0c',
          nama: 'Piutang Titipan Supplier',
          nomor_jenis_rekening: '0102003',
          sub_kelompok_id: '4adc76be-2da0-47a9-8f75-9523364c456b',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '26dbc136-8687-4903-b21e-462f088b19f0',
          nama: 'Piutang Karyawan',
          nomor_jenis_rekening: '0102004',
          sub_kelompok_id: '4adc76be-2da0-47a9-8f75-9523364c456b',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '40557d23-d5e7-4e77-9faf-00fe0cf750c2',
          nama: 'Persediaan Bahan Baku',
          nomor_jenis_rekening: '0103011',
          sub_kelompok_id: 'ce8ad28c-501d-4832-958b-5d29ba819eb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1c89c4ab-b9b7-48b2-be9a-4cdd08f5e710',
          nama: 'Persediaan Barang dalam Proses',
          nomor_jenis_rekening: '0103012',
          sub_kelompok_id: 'ce8ad28c-501d-4832-958b-5d29ba819eb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1950bc71-5324-4656-8fbc-69122c939be6',
          nama: 'Persediaan Barang Jadi',
          nomor_jenis_rekening: '0103013',
          sub_kelompok_id: 'ce8ad28c-501d-4832-958b-5d29ba819eb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '237fd5b9-bd9e-45f9-be34-ebdddbcb077f',
          nama: 'Persediaan Bahan Penolong',
          nomor_jenis_rekening: '0103014',
          sub_kelompok_id: 'ce8ad28c-501d-4832-958b-5d29ba819eb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '228dd209-7a39-4c17-ab0c-3b9682554b1d',
          nama: 'Persediaan Kemasan',
          nomor_jenis_rekening: '0103015',
          sub_kelompok_id: 'ce8ad28c-501d-4832-958b-5d29ba819eb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '829c53fd-3970-42b7-aaab-5543d2295ba3',
          nama: 'Sewa Dibayar Dimuka',
          nomor_jenis_rekening: '0104001',
          sub_kelompok_id: '39a3436c-3399-4202-9a6b-fec4c08d7bdd',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '14a40682-ec31-485e-99ff-3b4f8ed83dba',
          nama: 'Asuransi Dibayar Dimuka',
          nomor_jenis_rekening: '0104002',
          sub_kelompok_id: '39a3436c-3399-4202-9a6b-fec4c08d7bdd',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5b7bf142-9e6f-4957-a427-f12cd8a028b7',
          nama: 'Pajak Perusahaan PPh 25 Dibayar Dimuka',
          nomor_jenis_rekening: '0104011',
          sub_kelompok_id: '39a3436c-3399-4202-9a6b-fec4c08d7bdd',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'fe901c97-1bbd-4015-9888-6064fd366d1a',
          nama: 'Pajak Gaji PPh 21 / 26 Dibayar Dimuka',
          nomor_jenis_rekening: '0104012',
          sub_kelompok_id: '39a3436c-3399-4202-9a6b-fec4c08d7bdd',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'bbbea78a-a076-42ab-b132-0644e733d41d',
          nama: 'Pajak PPn Masukan (Dibayar Dimuka)',
          nomor_jenis_rekening: '0104013',
          sub_kelompok_id: '39a3436c-3399-4202-9a6b-fec4c08d7bdd',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1bb35fa6-10da-4854-b38c-f25e6fc3ba60',
          nama: 'Bangunan Tetap',
          nomor_jenis_rekening: '0105001',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ede33c38-65e2-4f8b-b300-f8aa2a771dff',
          nama: 'Bangunan Tidak Tetap',
          nomor_jenis_rekening: '0105002',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '49d99fa3-5cf6-4f4b-97d1-a68f3c4c0f0a',
          nama: 'Peralatan Komputer & Sejenisnya',
          nomor_jenis_rekening: '0105011',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5a180ed9-d700-4145-a0c7-5d1402430cbd',
          nama: 'Kendaraan Roda 2 / 3',
          nomor_jenis_rekening: '0105012',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4db061f1-85c5-469a-8949-f17f0aebca9b',
          nama: 'Furnitur Kayu',
          nomor_jenis_rekening: '0105013',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b6bc5fd2-2370-4a5b-8115-24bb533f5bc3',
          nama: 'Pesawat Telepon, HP,  dan Alat Komunikasi Lainnya',
          nomor_jenis_rekening: '0105014',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '07642694-9ee0-4d47-9332-552671a24b42',
          nama: 'Inventaris Golongan 1 Lain-Lain',
          nomor_jenis_rekening: '0105015',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '116a5566-cc08-4031-adf8-a3014a011305',
          nama: 'Furnitur dari Logam',
          nomor_jenis_rekening: '0105021',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'a81e52d8-5a63-4009-a514-c431bf08370a',
          nama: 'Peralatan dari Logam',
          nomor_jenis_rekening: '0105022',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd9398d4d-5b51-4695-8ca3-aad86f6ba63b',
          nama: 'Mobil, bus, truk, speed boat dan sejenisnya',
          nomor_jenis_rekening: '0105023',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'dba0671c-7abc-449f-af2d-9da9a82ea4d0',
          nama: 'Inventaris Golongan 2 Lain-Lain',
          nomor_jenis_rekening: '0105024',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '44dee9e1-c915-40c9-a3a8-138a21c5f85d',
          nama: 'Mesin Produksi & Peralatan Berat',
          nomor_jenis_rekening: '0105031',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ae78b591-5841-4933-9684-34f5ba104532',
          nama: 'Inventaris Golongan 3 Lain-Lain',
          nomor_jenis_rekening: '0105032',
          sub_kelompok_id: '88400de2-e950-450c-9c4b-bc8e923d90c4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ba363a7c-a5df-4ca9-94b6-efcd2591dcea',
          nama: 'Ak. Penyusutan - Bangunan Tetap',
          nomor_jenis_rekening: '0106001',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'db58836e-31d7-4301-b602-9b2961829a5c',
          nama: 'Ak. Penyusutan - Bangunan Tidak Tetap',
          nomor_jenis_rekening: '0106002',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '9e62eb9b-c334-4eb3-b05d-0ca2f6a31167',
          nama: 'Ak. Penyusutan - Peralatan Komputer & Sejenisnya',
          nomor_jenis_rekening: '0106011',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'c9c8c143-0109-42ed-8390-ed907564183b',
          nama: 'Ak. Penyusutan - Kendaraan Roda 2 / 3',
          nomor_jenis_rekening: '0106012',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ada7d17f-f414-4e7c-bb6d-46f765486077',
          nama: 'Ak. Penyusutan - Furnitur Kayu',
          nomor_jenis_rekening: '0106013',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '147106f6-ce80-4af8-9a75-bffd6b3b8c92',
          nama: 'Ak. Penyusutan - Pesawat Telepon, HP, dan Alat Komunikasi Lainnya',
          nomor_jenis_rekening: '0106014',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'f107dcd3-6078-4ddd-a2c9-122f9c2216b4',
          nama: 'Ak. Penyusutan - Inventaris Golongan 1 Lain-Lain',
          nomor_jenis_rekening: '0106015',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '12e1784b-a3af-4ff7-8fb0-a7b2db675832',
          nama: 'Ak. Penyusutan - Furnitur dari Logam',
          nomor_jenis_rekening: '0106021',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6250fae9-d0de-4878-b8ac-ab9a287b65c2',
          nama: 'Ak. Penyusutan - Peralatan dari Logam',
          nomor_jenis_rekening: '0106022',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2f4c5f27-866a-4901-ae2c-3d95997d506f',
          nama: 'Ak. Penyusutan - Mobil, bus, truk, speed boat dan sejenisnya',
          nomor_jenis_rekening: '0106023',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2c3c5268-84ae-4063-b34c-1b1724b78e8d',
          nama: 'Ak. Penyusutan - Inventaris Golongan 2 Lain-Lain',
          nomor_jenis_rekening: '0106024',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '042a1218-bbb0-4c50-a4c2-d3c4ed4e6664',
          nama: 'Ak. Penyusutan - Mesin Produksi & Peralatan Berat',
          nomor_jenis_rekening: '0106031',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b1be6462-2ab6-4f87-b6c8-a93a7e59de96',
          nama: 'Ak. Penyusutan - Inventaris Golongan 3 Lain-Lain',
          nomor_jenis_rekening: '0106032',
          sub_kelompok_id: '55600dc3-e356-47d0-8e5f-68550702fe29',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4e5da530-4c0d-450a-8c0c-4648654de6e0',
          nama: 'Tagihan Penjualan Angsuran (TPA)',
          nomor_jenis_rekening: '0107001',
          sub_kelompok_id: 'dce56946-db83-49da-9f7a-846c4dfcd3e0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1e463753-3920-48f0-859c-4fa908cf93e4',
          nama: 'Tagihan Tuntutan Perbendaharaan / Ganti Rugi (TP/TGR)',
          nomor_jenis_rekening: '0107002',
          sub_kelompok_id: 'dce56946-db83-49da-9f7a-846c4dfcd3e0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ef067f26-62b5-466e-8cca-ecb6f25aa41e',
          nama: 'Piutang Anak-Induk Usaha',
          nomor_jenis_rekening: '0108000',
          sub_kelompok_id: 'f403221d-30f4-4912-bb27-dd061039e5a0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '29644de3-3011-4f40-9f0e-54d5fb957b6e',
          nama: 'Piutang Tidak Tertagih',
          nomor_jenis_rekening: '0108001',
          sub_kelompok_id: 'f403221d-30f4-4912-bb27-dd061039e5a0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '06d9b510-3fc2-46ad-ab32-8851ff5a3355',
          nama: 'Piutang Dihapuskan',
          nomor_jenis_rekening: '0108002',
          sub_kelompok_id: 'f403221d-30f4-4912-bb27-dd061039e5a0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'fcfca911-1f56-4bb4-9555-8005dc99de33',
          nama: 'Piutang Dicadangkan',
          nomor_jenis_rekening: '0108003',
          sub_kelompok_id: 'f403221d-30f4-4912-bb27-dd061039e5a0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '3db4ce4c-e087-4c2f-90a9-a91125aebf12',
          nama: 'Akta Pendirian',
          nomor_jenis_rekening: '0109001',
          sub_kelompok_id: 'eafa5ece-5781-45ca-9b0d-c3fd7cd1d67d',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '02ef3693-0ad1-4283-b485-8a170ad90082',
          nama: 'Aktiva Tetap Lain',
          nomor_jenis_rekening: '0109002',
          sub_kelompok_id: 'eafa5ece-5781-45ca-9b0d-c3fd7cd1d67d',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ec44a240-cb28-4db2-abdb-a4e4cfae7cfa',
          nama: 'Deposito',
          nomor_jenis_rekening: '0110001',
          sub_kelompok_id: '57833672-b62f-4e8b-8e93-e6d58f5b60ed',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6da976a9-d181-4400-bfba-f15fd58f2cd2',
          nama: 'Hutang Dagang',
          nomor_jenis_rekening: '0201001',
          sub_kelompok_id: '0e516dbc-3d9a-4e78-b102-a9cf2f0a8be9',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ab5226fa-735f-484b-94a3-d1aca3529ed8',
          nama: 'Hutang Cek / BG',
          nomor_jenis_rekening: '0201002',
          sub_kelompok_id: '0e516dbc-3d9a-4e78-b102-a9cf2f0a8be9',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5252dc48-107a-4be3-8e57-0adaaca77bca',
          nama: 'Hutang Titipan Customer',
          nomor_jenis_rekening: '0201003',
          sub_kelompok_id: '0e516dbc-3d9a-4e78-b102-a9cf2f0a8be9',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'e237b9a0-6696-4ddd-a0dc-8fe7b5f9e636',
          nama: 'Hutang Jangka Panjang yang Jatuh Tempo',
          nomor_jenis_rekening: '0201004',
          sub_kelompok_id: '0e516dbc-3d9a-4e78-b102-a9cf2f0a8be9',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'fcf6ced6-1c39-41cf-9d30-aee2b76274ac',
          nama: 'Gaji & THR Masih Harus Dibayar',
          nomor_jenis_rekening: '0202001',
          sub_kelompok_id: 'baf8d190-1f10-48f8-85d0-8f46ac405487',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5b543d10-3596-4394-80fb-0685943426cd',
          nama: 'Komisi Masih Harus Dibayar',
          nomor_jenis_rekening: '0202002',
          sub_kelompok_id: 'baf8d190-1f10-48f8-85d0-8f46ac405487',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2d9396fa-44c3-430f-822a-f9ed12b0e6df',
          nama: 'Tunjangan Masih Harus Dibayar',
          nomor_jenis_rekening: '0202003',
          sub_kelompok_id: 'baf8d190-1f10-48f8-85d0-8f46ac405487',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4f222134-2be8-4997-9eef-02905b2b9cdb',
          nama: 'Sewa Masih Harus Dibayar',
          nomor_jenis_rekening: '0203001',
          sub_kelompok_id: 'ce49e0a0-92bf-4dca-8221-9c1c3e3c6016',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '195308fc-1b85-487a-add9-11bbe6a013b1',
          nama: 'Bunga Masih Harus Dibayar',
          nomor_jenis_rekening: '0203002',
          sub_kelompok_id: 'ce49e0a0-92bf-4dca-8221-9c1c3e3c6016',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1e0e595e-2bb9-4ef9-989e-fd020ed6ca49',
          nama: 'Hutang Pajak PPh Perusahaan',
          nomor_jenis_rekening: '0204001',
          sub_kelompok_id: 'd0940ae7-a907-4f38-b003-0b54f457eeb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6470e683-ce01-45f3-910d-a69e1c728a07',
          nama: 'Hutang Pajak PPh Gaji Karyawan',
          nomor_jenis_rekening: '0204002',
          sub_kelompok_id: 'd0940ae7-a907-4f38-b003-0b54f457eeb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '63dce0f2-b711-4df5-bdb5-0bc5f4b55914',
          nama: 'Hutang Pajak PPn / PPn Keluaran',
          nomor_jenis_rekening: '0204003',
          sub_kelompok_id: 'd0940ae7-a907-4f38-b003-0b54f457eeb5',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2105cd12-d21a-4518-a414-3fd36374d4bc',
          nama: 'Hutang Bank',
          nomor_jenis_rekening: '0207001',
          sub_kelompok_id: '84bf49cb-f30d-47d4-8413-39b4cb8ecb12',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4ec7482a-909c-4dfc-afe1-63ae66709cd9',
          nama: 'Hutang Antar Perusahaan',
          nomor_jenis_rekening: '0208000',
          sub_kelompok_id: 'a44d8e36-6ef1-407e-8ca6-005cda5ec16f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5776f47b-c418-4e4a-b1ec-8c8dbcf31ed9',
          nama: 'Modal Disetor',
          nomor_jenis_rekening: '0303000',
          sub_kelompok_id: 'be905f3d-a252-43be-9d49-5261c47937e9',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b5f3fb9f-d4d0-4c8b-a70b-679a3c90347c',
          nama: 'Modal Mitra',
          nomor_jenis_rekening: '0304000',
          sub_kelompok_id: '6eff9d6a-236b-4144-b9dd-460f6262bc5e',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '46bff4e1-7e48-4fa1-b4b4-aa0ceecc8262',
          nama: 'Kontribusi Member',
          nomor_jenis_rekening: '0305000',
          sub_kelompok_id: '890f9d94-752e-4cb4-ada4-e0793eb301d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd35329ca-6698-4014-b3d1-e8c587aea2e2',
          nama: 'Laba Periode Berjalan',
          nomor_jenis_rekening: '0309001',
          sub_kelompok_id: '44cfdb83-59d4-477e-9493-5f7eecd442af',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '483d034d-5ec3-484b-b104-8dbf5543cdb7',
          nama: 'Laba Tahun Berjalan',
          nomor_jenis_rekening: '0309002',
          sub_kelompok_id: '44cfdb83-59d4-477e-9493-5f7eecd442af',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ca8c9581-07e9-4b83-a2f7-1eb7c6b58cbe',
          nama: 'Akumulasi Laba s/d Tahun Lalu',
          nomor_jenis_rekening: '0309003',
          sub_kelompok_id: '44cfdb83-59d4-477e-9493-5f7eecd442af',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b12dd70b-f9ee-4187-9905-947b290a818c',
          nama: 'Diskon Penjualan',
          nomor_jenis_rekening: '0401000',
          sub_kelompok_id: 'be7133cd-c549-4d9d-a065-93b74806bb5c',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1aa50c7f-d08e-47a9-a10f-be0fa521f44b',
          nama: 'Pendapatan Penjualan Barang Dagangan',
          nomor_jenis_rekening: '0402000',
          sub_kelompok_id: '98463b94-1b58-4139-bc4c-ae8db8c12998',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '790f078b-e796-49a2-994a-b8528d1337c8',
          nama: 'HPP - Bahan Baku',
          nomor_jenis_rekening: '0501001',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '950426b7-6d31-4cb3-afb6-98cfb5bc5ed2',
          nama: 'HPP - Barang dalam Proses',
          nomor_jenis_rekening: '0501002',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd1dd07b0-9834-4f3c-9c54-a6348ec7b1b4',
          nama: 'HPP - Barang Jadi',
          nomor_jenis_rekening: '0501003',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4ebdbb26-8118-43d9-8252-025edcca3bf5',
          nama: 'HPP - Bahan Penolong',
          nomor_jenis_rekening: '0501004',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'bb087f28-4834-41b7-acd0-318bd06425e6',
          nama: 'HPP - Kemasan',
          nomor_jenis_rekening: '0501005',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'f4238950-a481-44c9-9586-ad10c8224ed6',
          nama: 'Biaya Produksi - Gaji',
          nomor_jenis_rekening: '0501005',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '463e1428-0609-4aa2-a7be-477b8f3cf4ef',
          nama: 'Biaya Produksi Sampingan Lain / Overhead',
          nomor_jenis_rekening: '0501006',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '9cedc3e6-f8ce-492b-a01b-aa286bca2527',
          nama: 'Potongan HPP - Diskon Pembelian',
          nomor_jenis_rekening: '0501007',
          sub_kelompok_id: '595546bb-27f1-48d2-83c0-d3cac215212f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd63ea511-44b3-4d4f-885c-39f338abb920',
          nama: 'Biaya Stok Opnam',
          nomor_jenis_rekening: '0502001',
          sub_kelompok_id: 'dceba56e-0b15-41b3-b45c-f567b1ecdf80',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1ccfb2be-7ecb-4d5d-a8f4-42a5ef66b25f',
          nama: 'Gaji & Tunjangan - marketing',
          nomor_jenis_rekening: '0601001',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2b060460-a8ac-4cd9-baaf-cd62de65e291',
          nama: 'Pulsa Handphone - marketing',
          nomor_jenis_rekening: '0601002',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ce716716-2b46-4c0a-97a3-54c103f61ab1',
          nama: 'Keperluan Kantor - marketing',
          nomor_jenis_rekening: '0601003',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'cde43d73-2452-43e1-bcba-ccc75dfa14d2',
          nama: 'Transportasi & Distribusi - marketing',
          nomor_jenis_rekening: '0601004',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '25743606-7b6b-4490-8883-9224da99cf7c',
          nama: 'Jasa Bulanan - marketing',
          nomor_jenis_rekening: '0601005',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '470f3284-7d8d-45e8-8511-29e3a759dea3',
          nama: 'Konsumsi - marketing',
          nomor_jenis_rekening: '0601006',
          sub_kelompok_id: '6d3f0c02-f438-4764-b420-448b838250d2',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '3148d37f-a022-4d95-92ad-106cd9b353f5',
          nama: 'Gaji & Tunjangan - penjualan',
          nomor_jenis_rekening: '0602001',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '0632c684-0471-4149-9581-71c912943b46',
          nama: 'Pulsa Handphone - penjualan',
          nomor_jenis_rekening: '0602002',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '81863c03-356b-463e-bb1e-436c18908e3e',
          nama: 'Keperluan Kantor - penjualan',
          nomor_jenis_rekening: '0602003',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '35171745-40ae-435d-9187-57da04a07c99',
          nama: 'Transportasi & Distribusi - penjualan',
          nomor_jenis_rekening: '0602004',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'f7f40bc0-3311-4058-a4d1-df6677023fc2',
          nama: 'Jasa Bulanan - penjualan',
          nomor_jenis_rekening: '0602005',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '2d67db7c-fc58-4c74-a8b4-e701f0ee1e02',
          nama: 'Konsumsi - penjualan',
          nomor_jenis_rekening: '0602006',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd8e781ac-7660-462d-a9c8-e27be7a6f7bf',
          nama: 'Komisi - penjualan',
          nomor_jenis_rekening: '0602007',
          sub_kelompok_id: '2be1ace6-37a2-4d57-95de-a02959b3d0ab',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5121559e-a5d4-4eb2-bc78-31c01836ac8c',
          nama: 'Gaji & Tunjangan - adm & umum',
          nomor_jenis_rekening: '0603001',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '8f1077c2-539b-4aca-b591-94659ed12dd2',
          nama: 'Sewa - adm & umum',
          nomor_jenis_rekening: '0603002',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '0d2c8357-ea7c-42c5-be34-ff008e907029',
          nama: 'Listrik, Air, Telepon Kantor - adm & umum',
          nomor_jenis_rekening: '0603003',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b665b7b9-4bff-4893-8b8b-c4f8706bf3ca',
          nama: 'Pulsa Handphone - adm & umum',
          nomor_jenis_rekening: '0603004',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '8118e625-a1d4-4473-a18f-76742d7dc69f',
          nama: 'Keperluan Kantor - adm & umum',
          nomor_jenis_rekening: '0603005',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '54e27348-2a8f-4e93-a4be-addedc455886',
          nama: 'Transportasi & Distribusi - adm & umum',
          nomor_jenis_rekening: '0603006',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '04be31db-5245-43dd-8c25-53ae8f8a8940',
          nama: 'Servis Peralatan - adm & umum',
          nomor_jenis_rekening: '0603007',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '36aad7ca-6bda-4489-9c33-03a50f6dc88a',
          nama: 'Jasa Bulanan - adm & umum',
          nomor_jenis_rekening: '0603008',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'caba339b-8f87-4cc2-ba6c-5cabe7e1c894',
          nama: 'Konsumsi - adm & umum',
          nomor_jenis_rekening: '0603008',
          sub_kelompok_id: '8e0dd1bf-d18a-4d93-b86c-7fcb56de928a',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '115ea892-7214-407f-84a9-9a90a9194769',
          nama: 'Biaya Penyusutan - Bangunan Tetap',
          nomor_jenis_rekening: '0604001',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '40e56a6a-f97a-4605-a84a-cfd981f4956f',
          nama: 'Biaya Penyusutan - Bangunan Tidak Tetap',
          nomor_jenis_rekening: '0604002',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5c1cab5b-4875-4128-9ed6-eeb71f0dbf4f',
          nama: 'Biaya Penyusutan - Peralatan Komputer & Sejenisnya',
          nomor_jenis_rekening: '0604003',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'd091b6f1-485a-458c-8df1-60d1594dd89c',
          nama: 'Biaya Penyusutan - Kendaraan Roda 2 / 3',
          nomor_jenis_rekening: '0604004',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6855f52e-bfd7-465b-adf7-1e354c2936c1',
          nama: 'Biaya Penyusutan - Furnitur Kayu',
          nomor_jenis_rekening: '0604005',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '79e383ff-46c4-4c14-b5aa-aab225019769',
          nama: 'Biaya Penyusutan - Pesawat Telepon, HP, dan Alat Komunikasi Lainnya',
          nomor_jenis_rekening: '0604006',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '1e0c6da6-bb79-402c-8e0c-5e214203899d',
          nama: 'Biaya Penyusutan - Inventaris Golongan 1 Lain-Lain',
          nomor_jenis_rekening: '0604007',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'bca69d6a-355e-409e-9d93-99f153746dc7',
          nama: 'Biaya Penyusutan - Furnitur dari Logam',
          nomor_jenis_rekening: '0604008',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'edd7f969-670d-40cb-8da6-75d1e389d426',
          nama: 'Biaya Penyusutan - Peralatan dari Logam',
          nomor_jenis_rekening: '0604009',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'cf057956-bed2-4475-911a-d2f8158b520d',
          nama: 'Biaya Penyusutan - Mobil, bus, truk, speed boat dan sejenisnya',
          nomor_jenis_rekening: '0604010',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '17c8861c-8065-4a20-a41c-7b83704a1338',
          nama: 'Biaya Penyusutan - Inventaris Golongan 2 Lain-Lain',
          nomor_jenis_rekening: '0604011',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '5e9bc95f-902a-411c-a5ed-462f20fbf4f6',
          nama: 'Biaya Penyusutan - Mesin Produksi & Peralatan',
          nomor_jenis_rekening: '0604012',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ede77d5a-b0c3-428e-a378-b04bc3cd16ef',
          nama: 'Biaya Penyusutan - Inventaris Golongan 3 Lain-Lain',
          nomor_jenis_rekening: '0604013',
          sub_kelompok_id: '4293763c-a0f6-465c-bd99-096cf07dbdd1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'c5fabc00-ec6a-49cb-b183-84c18fdd9098',
          nama: 'Pendapatan Bunga Bank',
          nomor_jenis_rekening: '0701001',
          sub_kelompok_id: 'f6fb6d55-3db6-4b9b-bd7d-915c00ece7d0',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '9e5b7a5f-860b-4bd6-bf4e-648305a77a8d',
          nama: 'Pendapatan Penjualan Aset',
          nomor_jenis_rekening: '0702001',
          sub_kelompok_id: 'a119930b-1f6a-4942-86b9-d99b7498fece',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '6f5508aa-4327-4d83-b7cf-e65d9679ccb5',
          nama: 'Pendapatan Penjualan Lain-lain',
          nomor_jenis_rekening: '0702002',
          sub_kelompok_id: 'a119930b-1f6a-4942-86b9-d99b7498fece',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'b0697a57-d122-480e-bdab-6416b5657e5e',
          nama: 'Pajak Bunga Bank',
          nomor_jenis_rekening: '0801001',
          sub_kelompok_id: '2bb789e0-36ca-42f5-abdf-fe9eadd069b1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'f97d8b18-d14e-4305-8193-e36dc3e08503',
          nama: 'Biaya Administrasi Bank',
          nomor_jenis_rekening: '0801002',
          sub_kelompok_id: '2bb789e0-36ca-42f5-abdf-fe9eadd069b1',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '192e60f7-4f29-4195-a77a-23240f81d36a',
          nama: 'Pengeluaran Lain-Lain',
          nomor_jenis_rekening: '0802000',
          sub_kelompok_id: 'b6109d58-3176-48ca-8967-7f4e47bc4df4',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'e973c70c-7274-4201-aa8f-47316f5225f0',
          nama: 'Biaya Pajak PPh Final UMKM',
          nomor_jenis_rekening: '901001',
          sub_kelompok_id: '3636f32d-795d-4f0e-9372-eadcd722780f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: '4b972179-c2ca-4fe2-b70d-0fe6c3caebf1',
          nama: 'Biaya Pajak Final Lainnya',
          nomor_jenis_rekening: '901002',
          sub_kelompok_id: '3636f32d-795d-4f0e-9372-eadcd722780f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       },
       {
          id: 'ac069d31-741c-4a78-b2bf-7678291c5e07',
          nama: 'Biaya Pajak PPh',
          nomor_jenis_rekening: '901003',
          sub_kelompok_id: '3636f32d-795d-4f0e-9372-eadcd722780f',
          is_default: true,
          created_at: new Date(),
          updated_at: new Date()
       }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Jenis_Rekenings', null, {});
  },
};
