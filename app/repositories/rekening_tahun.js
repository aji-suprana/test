// saldo_awal_tahun = rekeningTahunPrev.saldo_awal_tahun + rekeningTahunPrev.sum_tahun
// sum_tahun = sum(currentRekeningTahun.bulan.debit) - sum(currentRekeningTahun.bulan.credit)
// difference_credit = -1 * (new_value - old_value)
// difference_debit = 1 * (new_value - old_value)
// rekeningTahunNex.saldo_awal_tahun + difference
const { Rekening_Tahun, Rekening_Bulan, Rekening } = require('../models');
const flaverr = require("flaverr");
const _ = require('lodash');
var library = {}

/**
 * Create RekeningTahun
 * @param  {Number} options.tahun            Year of RekeningTahun
 * @param  {Number} options.saldo_awal_tahun Number of saldo_awal_tahun, default 0.0
 * @param  {String} options.rekening_id      UUID of Rekening
 * @param  {String} options.brand_id         UUID of Brand
 * @param  {Object} options.transactions     Object of transactions
 * @return {Object}                          Return Object containing status and or error object
 */
library.Create = async ({ tahun, saldo_awal_tahun = 0.0, rekening_id, brand_id, transactions = {} } = {}) => {
	try {
    let transaction = {};

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		let rekeningTahunData = {
			tahun,
			rekening_id,
			brand_id
		};

    let exist = await library.FindOne({
      params: rekeningTahunData,
      transactions: transaction.transaction
    });

    if (exist.status && exist.data) throw flaverr('E_DUPLICATE', Error(`rekening tahun already exist`));

    let next_tahun = await library.FindOne({
      params: {
        tahun: tahun + 1,
        rekening_id: rekening_id,
        brand_id: brand_id
      },
      transactions: transaction.transaction
    });

    if (next_tahun.status) rekeningTahunData.next_tahun = next_tahun.data.id;

    let previous_tahun = await library.FindOne({
      params: {
        tahun: tahun - 1,
        rekening_id: rekening_id,
        brand_id: brand_id
      },
      transactions: transaction.transaction
    });

    if (previous_tahun.status) {
      rekeningTahunData.previous_tahun = previous_tahun.data.id;
      saldo_awal_tahun += (previous_tahun.data.sum_tahun + previous_tahun.data.saldo_awal_tahun);
    }

    if (saldo_awal_tahun) rekeningTahunData.saldo_awal_tahun = saldo_awal_tahun;

		const rekeningTahun = await Rekening_Tahun.create(rekeningTahunData, {...transaction});

		if (!rekeningTahun) throw flaverr('E_ERROR', Error(`failed to create rekening tahun`));

    if (previous_tahun.status) {
      previous_tahun.data.next_tahun = rekeningTahun.id;

      await previous_tahun.data.save(transaction);
    }

		return {
			status: true,
			data: rekeningTahun
		};
	}
	catch (err) {
		return {
			status: false,
			err: err
		};
	}
};

/**
 * Update RekeningTahun
 * @param  {String} options.id     UUID of RekeningTahun
 * @param  {Object} options.update Object of field and value to update
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object of status and or error object
 */
library.Update = async ({ id, update = {}, transactions = {} } = {}) => {
	try {
		let transaction = {};

    if (!id || _.isEmpty(update)) throw flaverr('E_BAD_REQUEST', Error(`id or update params not provided`));

		if (transactions) transaction.transaction = transactions;

		const rekeningTahun = await Rekening_Tahun.findOne({
			where: {
				id: id
			},
      include: [{
        model: Rekening_Tahun,
        as: 'Next'
      }],
      ...transaction
		});

    if (!rekeningTahun) throw flaverr('E_NOT_FOUND', Error(`rekening tahun with id ${id} not found`));

		Object.keys(update).forEach((key) => {
      if (key === 'saldo_awal_tahun') {
        if (typeof update[key] !== 'number') {
          throw flaverr('E_BAD_REQUEST', Error(`saldo awal tahun must be a number`));
        }

        update[key] = Number.parseFloat(update[key]);
      }
      if (key !== 'sum_tahun') if (update[key]) rekeningTahun[key] = update[key];
    });

    await rekeningTahun.save(transaction);

    // check if value updated is saldo_awal_tahun
    if (_.has(update, 'saldo_awal_tahun') && update.saldo_awal_tahun) {
      // check if has next year
      if (_.has(rekeningTahun, 'Next') && rekeningTahun.Next) {
        // update rekening tahun next year
        let saldo = rekeningTahun.saldo_awal_tahun + rekeningTahun.sum_tahun;
        const updateSaldoRekeningTahunNextYear = await library.Update({
          id: rekeningTahun.Next.id,
          update: {
            saldo_awal_tahun: saldo
          },
          transactions: transaction.transaction
        });

        if (!updateSaldoRekeningTahunNextYear.status && updateSaldoRekeningTahunNextYear.err) {
          throw updateSaldoRekeningTahunNextYear.err;
        }
      }
    }

    return {
    	status: true,
    	data: rekeningTahun
    };
	}
	catch (err) {
		return {
			status: false,
			err: err
		};
	}
};

/**
 * UpdateSumCredit RekeningTahun
 * @param  {String} options.id          UUID of RekeningTahun
 * @param  {String} options.rekening_id UUID of Rekening
 * @param  {Number} options.tahun       Number of tahun
 * @param  {Number} nominal             Number of nominal
 * @param  {Object} transactions        Object of transactions
 * @return {Object}                     Return object containing status and or error object
 */
library.UpdateSumCredit = async ({ id, rekening_id, tahun, nominal = 0.0, transactions = {} } = {}) => {
  try {
    let transaction = {};
    let params = {};

    if (rekening_id && tahun) {
      params.rekening_id = rekening_id;
      params.tahun = tahun;
    }
    else if (id) {
      params.id = id;
    }
    else {
      throw flaverr('E_BAD_REQUEST', Error(`paramaters to find rekening tahun is not provided`));
    }

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let rekeningTahun = await library.FindOne({
      params,
      transactions: transaction.transaction
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;

    if (nominal && typeof nominal !== 'number') {
      throw flaverr('E_BAD_REQUEST', Error(`nominal must be a number`));
    }

    rekeningTahun = rekeningTahun.data;

    rekeningTahun.sum_tahun -= Number.parseFloat(nominal);

    await rekeningTahun.save(transaction);

    let saldo = rekeningTahun.sum_tahun + rekeningTahun.saldo_awal_tahun;

    // check if has next year account
    if (_.has(rekeningTahun, 'Next') && rekeningTahun.Next) {
      // update saldo awal tahun next year
      let updateSaldoAwalTahunNextYear = await library.Update({
        id: rekeningTahun.Next.id,
        update: {
          saldo_awal_tahun: saldo
        },
        transactions: transaction.transaction
      });

      if (!updateSaldoAwalTahunNextYear.status && updateSaldoAwalTahunNextYear.err) {
        throw updateSaldoAwalTahunNextYear.err;
      }
    }

    return {
      status: true,
      data: rekeningTahun
    };
  }
  catch (err) {
    return {
      status: false,
      err: err
    };
  }
};

/**
 * UpdateSumDebit RekeningTahun
 * @param  {String} options.id          UUID of RekeningTahun
 * @param  {String} options.rekening_id UUID of Rekening
 * @param  {Number} options.tahun       Number of tahun
 * @param  {Number} nominal             Nominal of debit
 * @param  {Object} transactions        Object of transactions
 * @return {Object}                     Return object containing status and or error object
 */
library.UpdateSumDebit = async ({ id, rekening_id, tahun, nominal = 0.0, transactions = {} } = {}) => {
  try {
    let transaction = {};
    let params = {};

    if (rekening_id && tahun) {
      params.rekening_id = rekening_id;
      params.tahun = tahun;
    }
    else if (id) {
      params.id = id;
    }
    else {
      throw flaverr('E_BAD_REQUEST', Error(`paramaters to find rekening tahun is not provided`));
    }

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let rekeningTahun = await library.FindOne({
      params,
      transactions: transaction.transaction
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;

    if (nominal && typeof nominal !== 'number') {
      throw flavver('E_BAD_REQUEST', Error(`nominal must be a number`));
    }

    rekeningTahun = rekeningTahun.data;

    rekeningTahun.sum_tahun += Number.parseFloat(nominal);

    await rekeningTahun.save(transaction);

    let saldo = rekeningTahun.sum_tahun + rekeningTahun.saldo_awal_tahun;

    // check if has next year account
    if (_.has(rekeningTahun, 'Next') && rekeningTahun.Next) {
      // update saldo awal tahun next year
      let updateSaldoAwalTahunNextYear = await library.Update({
        id: rekeningTahun.Next.id,
        update: {
          saldo_awal_tahun: saldo
        },
        transactions: transaction.transaction
      });

      if (!updateSaldoAwalTahunNextYear.status && updateSaldoAwalTahunNextYear.err) {
        throw updateSaldoAwalTahunNextYear.err;
      }
    }

    return {
      status: true,
      data: rekeningTahun
    };
  }
  catch (err) {
    return {
      status: false,
      err: err
    };
  }
};

/**
 * Destroy RekeningTahun by Id
 * @param  {String} options.id           UUID of RekeningTahun
 * @param  {Object} options.transactions Object of transaction
 * @return {Object}                      Return object containing status and or error object
 */
library.Destroy = async ({ id, transactions = {} }) => {
  try {
    let transaction = {};

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const rekeningTahun = await Rekening_Tahun.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!rekeningTahun) throw flaverr('E_NOT_FOUND', Error(`rekening tahun with id ${id} not found`));

    await rekeningTahun.destroy(transaction);

    return {
      status: true
    };
  }
  catch (err) {
    return {
      status: false,
      err: err
    };
  }
}

/**
 * Find all RekeningTahun with optional filter
 * @param  {Object} options.params Object containing field for filtering
 * @param  {Object} pagination     Object containing page and per_page for pagination
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindAll = async ({ params = {}, pagination = {}, transactions = {} } = {}) => {
	try {
		let where = {};

		let transaction = {};

		const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 10;

    if (params.tahun) where.tahun = params.tahun;
    if (params.rekening_id) where.rekening_id = params.rekening_id;
    if (params.brand_id) where.brand_id = params.brand_id;
    if (params.previous_tahun) where.previous_tahun = params.previous_tahun;
    if (params.next_tahun) where.next_tahun = params.next_tahun;

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const { count, rows } = await Rekening_Tahun.findAndCountAll({
			where: where,
			offset: (page - 1) * per_page,
			limit: per_page,
      ...transaction
		});

		if (count < 1) throw flaverr('E_NOT_FOUND', Error(`rekening tahun not found`));

		const result = paginate({
			data: rows,
			count,
			page,
			per_page
		});

		return {
			status: true,
			data: result
		};
	}
	catch (err) {
		return {
			status: false,
			err: err
		};
	}
};

/**
 * Find RekeningTahun by Id
 * @param  {String} options.id           UUID of RekeningTahun
 * @param  {Object} options.transactions Object of transaction
 * @return {Object}                      Return object containing status and or error object
 */
library.FindById = async ({ id, transactions = {} } = {}) => {
	try {
		let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const rekeningTahun = await Rekening_Tahun.findOne({
			where: {
				id: id
			},
			include: [{
				model: Rekening_Tahun,
				as: 'Next'
			}, {
				model: Rekening_Tahun,
				as: 'Previous'
			}, {
				model: Rekening_Bulan
			}, {
				model: Rekening
			}],
      ...transaction
		});

		if (!rekeningTahun) throw flaverr('E_NOT_FOUND', Error(`rekening tahun with ${id} not exist`));

		return {
			status: true,
			data: rekeningTahun
		};
	} catch (err) {
		return {
			status: false,
			err: err
		};
	}
}

/**
 * FindOne RekeningTahun
 * @param  {Object} options.params Object containing field to find data
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindOne = async ({ params = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (_.isEmpty(params)) throw flaverr('E_BAD_REQUEST', Error(`params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;
    const rekeningTahun = await Rekening_Tahun.findOne({
      where: {
        ...params
      },
      include: [{
        model: Rekening_Tahun,
        as: 'Next'
      }, {
        model: Rekening_Tahun,
        as: 'Previous'
      }, {
        model: Rekening_Bulan
      }, {
        model: Rekening
      }],
      ...transaction
    });

    if (!rekeningTahun) throw flaverr('E_NOT_FOUND', Error(`rekening tahun not found`));

    return {
      status: true,
      data: rekeningTahun
    };
  }
  catch (err) {
    return {
      status: false,
      err: err
    };
  }
}

module.exports = library;
