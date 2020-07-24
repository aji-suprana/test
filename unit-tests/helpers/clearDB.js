const db = require('../../app/models');

const clearDatabase = async function () {
  await db.Barang_JenisBarang.destroy({
    where: {},
    force: true,
  });
  await db.Barang_Konversi.destroy({
    where: {},
    force: true,
  });
  await db.Barang_Supplier.destroy({
    where: {},
    force: true,
  });
  await db.Harga_Jual.destroy({
    where: {},
    force: true,
  });
  await db.Barang.destroy({
    where: {},
    force: true,
  });
  await db.Jenis_Barang_Relasi.destroy({
    where: {},
    force: true,
  });
  await db.Jenis_Barang.destroy({
    where: {},
    force: true,
  });
  await db.Jenis_Harga_Jual.destroy({
    where: {},
    force: true,
  });
  await db.Konversi.destroy({
    where: {},
    force: true,
  });
  await db.Satuan.destroy({
    where: {},
    force: true,
  });
  await db.Alias.destroy({
    where: {},
    force: true,
  });
};

module.exports = clearDatabase;
