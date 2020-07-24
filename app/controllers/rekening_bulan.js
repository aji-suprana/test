const { success } = require('../services/httpRes');

const rekeningBulanRepo = require('../repositories/rekening_bulan');
const transactionRepository = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const brand_id = req.headers['x-brand'];

    const { bulan, tahun, rekening_id, rekening_tahun_id } = req.body;

    const tahun_id = rekening_tahun_id;

    const rekeningBulanData = { bulan, tahun, brand_id, rekening_id, rekening_tahun_id };

    const rekeningBulan = await rekeningBulanRepo.Create({
      ...rekeningBulanData
    });

    if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;

    return success(res, 201, rekeningBulan.data);
  } catch (err) {
    return next(err);
  }
};

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rekening_id} = req.body;

    const rekeningBulanData = { rekening_id };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    // update rekening bulan
    const rekeningBulan = await rekeningBulanRepo.Update({
      id: id,
      update: rekeningBulanData,
      transactions: transaction.data
    });

    // if failed to update rekeningbulan, rollback it
    if (!rekeningBulan.status && rekeningBulan.err) {
      await transactionRepository.Rollback(transaction.data);
      throw rekeningBulan.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, rekeningBulan.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const pagination = { page, per_page };

    const rekeningBulans = await rekeningBulanRepo.FindAll({
      params: {
        ...req.query
      },
      pagination
    });

    if (!rekeningBulans.status && rekeningBulans.err) throw rekeningBulans.err;

    return success(res, 200, rekeningBulans.data);
  } catch (err) {
    return next(err);
  }
};

library.FindById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekeningBulan = await rekeningBulanRepo.FindById({
      id: id
    });

    if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;

    return success(res, 200, rekeningBulan.data);
  } catch (err) {
    return next(err);
  }
};

library.Destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekeningBulan = await rekeningBulanRepo.Destroy({
      id: id
    });

    if (!rekeningBulan.status && rekeningBulan.err) throw periodeRekeningBulan.err;

    return success(res, 200, rekeningBulan.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
