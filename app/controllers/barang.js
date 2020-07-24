const { success } = require('../services/httpRes');

const barangRepository = require('../repositories/barang');
const barangSupplierRepo = require('../repositories/barang_supplier');
const barangKonversiRepo = require('../repositories/barang_konversi');
const barangJenisBarangRepo = require('../repositories/barang_jenisbarang');
const hargaJualRepo = require('../repositories/harga_jual');
const transactionRepo = require('../repositories/transaction');

const CreateNewBarang = async (req, res, next) => {
  try {
    const {
      nama_barang,
      kode_barang,
      satuan_id,
      konversi,
      tipe_barang,
      harga_jual,
      kategori_barang_id,
      alias_id,
      jenis_barang_id,
      supplier_id,
    } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const barangData = {
      nama_barang,
      kode_barang,
      satuan_id,
      tipe_barang,
      kategori_barang_id,
      alias_id,
    };

    if (isAdmin) {
      barangData.brand_id = null;
    } else {
      barangData.brand_id = brand_id;
    }

    // start transaction
    const transaction = await transactionRepo.Create();

    const barang = await barangRepository.CreateOne(
      barangData,
      transaction.data
    );

    if (!barang.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barang.err;
    }

    const barang_id = barang.data.id;

    // create barang supplier
    const barangSupplierData = { barang_id, supplier_id, brand_id };
    const barangSupplier = await barangSupplierRepo.CreateMany(
      barangSupplierData,
      transaction.data
    );

    if (!barangSupplier.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangSupplier.err;
    }

    // create barang konversi
    const barangKonversiData = { barang_id, konversi, brand_id };
    const barangKonversi = await barangKonversiRepo.CreateMany(
      barangKonversiData,
      transaction.data
    );

    if (!barangKonversi.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangKonversi.err;
    }

    // create barang jenis barang
    const barangJenisBarangData = { barang_id, jenis_barang_id, brand_id };
    const barangJenisBarang = await barangJenisBarangRepo.CreateMany(
      barangJenisBarangData,
      transaction.data
    );

    if (!barangJenisBarang.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangJenisBarang.err;
    }

    // create harga jual
    const hargaJualData = { barang_id, brand_id, harga_jual };
    const hargaJual = await hargaJualRepo.CreateMany(
      hargaJualData,
      transaction.data
    );

    if (!hargaJual.status) {
      await transactionRepo.Rollback(transaction.data);
      throw hargaJual.err;
    }

    // end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 201, barang.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllBarangs = async (req, res, next) => {
  try {
    const {
      nama_barang,
      jenis_barang_id,
      harga_jual,
      stok_min,
      supplier_id,
      kategori_barang_id,
      page,
      per_page,
    } = req.query;

    const params = {
      nama_barang,
      jenis_barang_id,
      harga_jual,
      stok_min,
      supplier_id,
      kategori_barang_id,
    };
    const pagination = { page, per_page };

    const barangs = await barangRepository.FindMany(params, pagination);

    if (!barangs.status) {
      throw barangs.err;
    }

    return success(res, 200, barangs.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const barang = await barangRepository.FindOne(id);

    if (!barang.status) {
      throw barang.err;
    }

    return success(res, 200, barang.data);
  } catch (err) {
    return next(err);
  }
};

const UpdateBarang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nama_barang,
      kode_barang,
      satuan_id,
      konversi,
      tipe_barang,
      harga_jual,
      kategori_barang_id,
      alias_id,
      jenis_barang_id,
      supplier_id,
    } = req.body;
    const brand_id = req.headers['x-brand'];
    const isAdmin = req.user.is_admin;

    const barangData = {
      nama_barang,
      kode_barang,
      satuan_id,
      tipe_barang,
      kategori_barang_id,
      alias_id,
    };

    if (isAdmin) {
      barangData.brand_id = null;
    } else {
      barangData.brand_id = brand_id;
    }

    // start transaction
    const transaction = await transactionRepo.Create();

    const barang = await barangRepository.UpdateOne(id, barangData);

    if (!barang.status) {
      throw barang.err;
    }

    const barang_id = id;

    // delete barang supplier
    const prevBarangSupplier = barang.data.Barang_Suppliers.map(
      (item) => item.id
    );
    const deleteBarangSupplier = await barangSupplierRepo.DeleteMany(
      prevBarangSupplier,
      transaction.data
    );

    if (!deleteBarangSupplier.status) {
      await transactionRepo.Rollback(transaction.data);
      throw deleteBarangSupplier.err;
    }

    // create barang supplier
    const barangSupplierData = { barang_id, supplier_id, brand_id };
    const barangSupplier = await barangSupplierRepo.CreateMany(
      barangSupplierData,
      transaction.data
    );

    if (!barangSupplier.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangSupplier.err;
    }

    // delete barang konversi
    const prevBarangKonversi = barang.data.Barang_Konversis.map(
      (item) => item.id
    );
    const deleteBarangKonversi = await barangKonversiRepo.DeleteMany(
      prevBarangKonversi,
      transaction.data
    );

    if (!deleteBarangKonversi.status) {
      await transactionRepo.Rollback(transaction.data);
      throw deleteBarangKonversi.err;
    }

    // create barang konversi
    const barangKonversiData = { barang_id, konversi, brand_id };
    const barangKonversi = await barangKonversiRepo.CreateMany(
      barangKonversiData,
      transaction.data
    );

    if (!barangKonversi.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangKonversi.err;
    }

    // delete barang jenis barang
    const prevBarangJenisBarang = barang.data.Barang_JenisBarangs.map(
      (item) => item.id
    );
    const deleteBarangJenisBarang = await barangJenisBarangRepo.DeleteMany(
      prevBarangJenisBarang,
      transaction.data
    );

    if (!deleteBarangJenisBarang.status) {
      await transactionRepo.Rollback(transaction.data);
      throw deleteBarangJenisBarang.err;
    }

    // create barang jenis barang
    const barangJenisBarangData = { barang_id, jenis_barang_id, brand_id };
    const barangJenisBarang = await barangJenisBarangRepo.CreateMany(
      barangJenisBarangData,
      transaction.data
    );

    if (!barangJenisBarang.status) {
      await transactionRepo.Rollback(transaction.data);
      throw barangJenisBarang.err;
    }

    // delete barang harga jual
    const prevHargaJual = barang.data.Harga_Juals.map((item) => item.id);
    const deleteHargaJual = await hargaJualRepo.DeleteMany(
      prevHargaJual,
      transaction.data
    );

    if (!deleteHargaJual.status) {
      await transactionRepo.Rollback(transaction.data);
      throw deleteHargaJual.err;
    }

    // create harga jual
    const hargaJualData = { barang_id, brand_id, harga_jual };
    const hargaJual = await hargaJualRepo.CreateMany(
      hargaJualData,
      transaction.data
    );

    if (!hargaJual.status) {
      await transactionRepo.Rollback(transaction.data);
      throw hargaJual.err;
    }

    // end transaction
    await transactionRepo.Commit(transaction.data);

    return success(res, 201, barang.data);
  } catch (err) {
    return next(err);
  }
};

const DeleteBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const barang = await barangRepository.DeleteOne(id);

    if (!barang.status) {
      throw barang.err;
    }

    return success(res, 201, barang.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewBarang,
  FindAllBarangs,
  FindOneBarang,
  UpdateBarang,
  DeleteBarang,
};
