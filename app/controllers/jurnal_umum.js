const { success } = require('../services/httpRes');

const jurnalUmumRepository = require('../repositories/jurnal_umum');
const transactionRepository = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const { tanggal, nomor_invoice, modul, debits, credits } = req.body;
    const brand_id = req.headers['x-brand'];

    const jurnalUmumData = { tanggal, nomor_invoice, modul, debits, credits, brand_id };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // create jurnal umum
    const jurnalUmum = await jurnalUmumRepository.Create({
      ...jurnalUmumData,
      transactions: transaction.data
    });

    // if failed to create jurnal umum, rollback it
    if (!jurnalUmum.status && jurnalUmum.err) {
      await transactionRepository.Rollback(transaction.data);
      throw jurnalUmum.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 201, jurnalUmum.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const pagination = { page, per_page };

    const jurnalUmums = await jurnalUmumRepository.FindAll({
      params: {
        ...req.query
      },
      pagination
    });

    if (!jurnalUmums.status && jurnalUmum.err) throw jurnalUmums.err;

    return success(res, 200, jurnalUmums.data);
  } catch (err) {
    return next(err);
  }
};

library.FindById = async (req, res, next) => {
  try {
    const jurnalUmum = await jurnalUmumRepository.FindById({ id: req.params.id });

    if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

    return success(res, 200, jurnalUmum.data);
  }
  catch (err) {
    return next(err);
  }
};

library.FindOne = async (req, res, next) => {
  try {
    const params = {};

    if (req.query.id) params.id = req.query.id;
    if (req.query.nomor_invoice) params.nomor_invoice = req.query.nomor_invoice;

    const jurnalUmum = await jurnalUmumRepository.FindOne({
      params
    });

    if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

    return success(res, 200, jurnalUmum.data);
  }
  catch (err) {
    return next(err);
  }
}

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tanggal, modul } = req.body;

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    const jurnalUmumData = { tanggal, modul };

    const jurnalUmum = await jurnalUmumRepository.Update({
      id: id,
      update: jurnalUmumData,
      transactions: transaction.data
    });

    // if failed update jurnal umum, rollback it
    if (!jurnalUmum.status && jurnalUmum.err) {
      await transactionRepository.Rollback(transaction.data);
      throw jurnalUmum.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, jurnalUmum.data);
  } catch (err) {
    return next(err);
  }
};

library.Destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // delete jurnal umum
    const jurnalUmum = await jurnalUmumRepository.Destroy({
      id: id,
      transactions: transaction.data
    });

    // rollback if failed delete jurnal umum
    if (!jurnalUmum.status && jurnalUmum.err) {
      await transactionRepository.Rollback(transaction.data);
      throw jurnalUmum.err;
    }

    // commit if success
    const commit = await transactionRepository.Commit(transaction.data);

    // auto rollback if failed to commit
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, jurnalUmum.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
