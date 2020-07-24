const { success } = require('../services/httpRes');

const creditRepository = require('../repositories/credit');
const transactionRepository = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const brand_id = req.headers['x-brand'];

    const { jurnal_umum_id, rekening_bulan_id, rekening_id, nominal } = req.body;

    const creditData = { jurnal_umum_id, rekening_bulan_id, rekening_id, brand_id, nominal };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // create credit
    const credit = await creditRepository.Create({
      ...creditData,
      transactions: transaction.data
    });

    // if failed to create credit, rollback it
    if (!credit.status && credit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw credit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 201, credit.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const pagination = { page, per_page };

    const credits = await creditRepository.FindAll({
      params: {
        ...req.query
      },
      pagination
    });

    if (!credits.status && credits.err) throw credits.err;

    return success(res, 200, credits.data);
  } catch (err) {
    return next(err);
  }
};

library.FindById = async (req, res, next) => {
  try {
    const credit = await creditRepository.FindById({ id: req.params.id });

    if (!credit.status && credit.err) throw credit.err;

    return success(res, 200, credit.data);
  }
  catch (err) {
    return next(err);
  }
};

library.FindOne = async (req, res, next) => {
  try {
    const credit = await credit.FindOne({
      params: {
        ...req.query
      }
    });

    if (!credit.status && credit.err) throw credit.err;

    return success(res, 200, credit.data);
  }
  catch (err) {
    return next(err);
  }
}

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rekening_bulan_id, rekening_id, nominal } = req.body;
    const creditData = { nominal, rekening_bulan_id, rekening_id };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // update credit
    const credit = await creditRepository.Update({
      id: id,
      update: creditData,
      transactions: transaction.data
    });

    // if failed to update credit, rollback it
    if (!credit.status && credit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw credit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, credit.data);
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

    const credit = await creditRepository.Destroy({
      id: id,
      transactions: transaction.data
    });

    // if failed to destroy credit, rollback it
    if (!credit.status && credit.err) {
      await transactionRepository.Rollback(transaction.data);
      throw credit.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, credit.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
