const { success } = require('../services/httpRes');

const rekeningTahunRepo = require('../repositories/rekening_tahun');
const transactionRepository = require('../repositories/transaction');

const library = {};

library.Create = async (req, res, next) => {
  try {
    const { tahun, rekening_id } = req.body;
    const brand_id = req.headers['x-brand'];

    const rekeningTahunData = { tahun, rekening_id, brand_id };

    const rekeningTahun = await rekeningTahunRepo.Create({
      ...rekeningTahunData
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;

    return success(res, 201, rekeningTahun.data);
  } catch (err) {
    return next(err);
  }
};

library.Update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rekening_id } = req.body;

    const rekeningTahunData = { rekening_id };

    // start transaction
    let transaction = await transactionRepository.Create();

    if (!transaction.status && transaction.err) throw transaction.err;

    const rekeningTahun = await rekeningTahunRepo.Update({
      id: id,
      update: rekeningTahunData,
      transactions: transaction.data
    });

    // if failed to update rekening tahun, rollback it
    if (!rekeningTahun.status && rekeningTahun.err) {
      await transactionRepository.Rollback(transaction.data);
      throw rekeningTahun.err;
    }

    // commit transaction
    const commit = await transactionRepository.Commit(transaction.data);

    // if commit false it will auto rollback
    if (!commit.status && commit.err) throw commit.err;

    return success(res, 200, rekeningTahun.data);
  } catch (err) {
    return next(err);
  }
};

library.FindAll = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const pagination = { page, per_page };

    const rekeningTahuns = await rekeningTahunRepo.FindAll({
      params: {
        ...req.query
      },
      pagination
    });

    if (!rekeningTahuns.status && rekeningTahuns.err) throw rekeningTahuns.err;

    return success(res, 200, rekeningTahuns.data);
  } catch (err) {
    return next(err);
  }
};

library.FindById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekeningTahun = await rekeningTahunRepo.FindById({
      id: id
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningBulan.err;

    return success(res, 200, rekeningTahun.data);
  } catch (err) {
    return next(err);
  }
};

library.Destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rekeningTahun = await rekeningTahunRepo.Destroy({
      id: id
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw periodeRekeningBulan.err;

    return success(res, 200, rekeningTahun.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = library;
