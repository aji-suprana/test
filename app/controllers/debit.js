const { success } = require('../services/httpRes');

const debitRepository = require('../repositories/debit');
const transactionRepository = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const brand_id = req.headers['x-brand'];

    const { jurnal_umum_id, rekening_bulan_id, rekening_id, nominal } = req.body;

    const debitData = { jurnal_umum_id, rekening_bulan_id, rekening_id, brand_id, nominal };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // create debit
    const debit = await debitRepository.Create({
      ...debitData,
      transactions: transaction.data
    });

    // if failed to create debit, rollback it
    if (!debit.status && debit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw debit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 201, debit.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const pagination = { page, per_page };

    const debits = await debitRepository.FindAll({
      params: {
        ...req.query
      },
      pagination
    });

    if (!debits.status && debits.err) throw debits.err;

    return success(res, 200, debits.data);
  } catch (err) {
    return next(err);
  }
};

library.FindById = async (req, res, next) => {
  try {
    const debit = await debitRepository.FindById({ id: req.params.id });

    if (!debit.status && debit.err) throw debit.err;

    return success(res, 200, debit.data);
  }
  catch (err) {
    return next(err);
  }
};

library.FindOne = async (req, res, next) => {
  try {
    const debit = await debit.FindOne({
      params: {
        ...req.query
      }
    });

    if (!debit.status && debit.err) throw debit.err;

    return success(res, 200, debit.data);
  }
  catch (err) {
    return next(err);
  }
}

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rekening_bulan_id, rekening_id, nominal } = req.body;
    const debitData = { nominal, rekening_bulan_id, rekening_id };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // update debit
    const debit = await debitRepository.Update({
      id: id,
      update: debitData,
      transactions: transaction.data
    });

    // if failed to update debit, rollback it
    if (!debit.status && debit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw debit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, debit.data);
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

    const debit = await debitRepository.Destroy({
      id: id,
      transactions: transaction.data
    });

    // if failed to destroy debit, rollback it
    if (!debit.status && debit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw debit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, debit.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
