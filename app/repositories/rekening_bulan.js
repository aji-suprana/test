const { Rekening_Bulan, Rekening_Tahun, Rekening, Sequelize, sequelize } = require('../models');
const rekeningTahunRepository = require('./rekening_tahun');
const _ = require('lodash');
const flaverr = require('flaverr');
var library = {};

/**
 * Create RekeningBulan if not exist
 * @param  {Number} options.bulan       Number of month
 * @param  {Number} options.tahun       Number of year
 * @param  {String} options.rekening_id UUID of Rekening
 * @param  {String} options.tahun_id    UUID of RekeningTahun
 * @param  {String} options.brand_id    UUID of Brand
 * @param  {Object} options.trasanctions Object of transaction
 * @return {Object}                     Return object containing status and or error object
 */
library.Create = async ({
	bulan,
  tahun,
	rekening_id,
	tahun_id,
	brand_id,
  transactions = {}
} = {}) => {
	try {
		let transaction = {};
		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let rekeningBulanData = {
      bulan,
      tahun,
      tahun_id,
      rekening_id,
      brand_id
    };

    let exist = await library.FindOne({
      params: rekeningBulanData,
      transactions: transaction
    });

    if (exist.status && exist.data) throw flaverr('E_DUPLICATE', Error(`rekening bulan already exist`));

    let next_bulan = await library.FindOne({
      params: {
        bulan: bulan + 1,
        tahun: tahun,
        rekening_id: rekening_id,
        brand_id: brand_id
      },
      transactions: transaction
    });

		if (next_bulan.status) rekeningBulanData.next_bulan = next_bulan.data.id;

    let previous_bulan = await library.FindOne({
      params: {
        bulan: bulan - 1,
        tahun: tahun,
        rekening_id: rekening_id,
        brand_id: brand_id
      },
      transactions: transaction
    });

		if (previous_bulan.status) rekeningBulanData.previous_bulan = previous_bulan.data.id;

		const rekeningBulan = await Rekening_Bulan.create(rekeningBulanData, {...transaction});

		if (!rekeningBulan) throw flaverr('E_ERROR', Error(`failed to create rekening bulan`));

    if (previous_bulan.status) {
      previous_bulan.data.next_bulan = rekeningBulan.id;

      await previous_bulan.data.save(transaction);
    }

		return {
			status: true,
			data: rekeningBulan
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
 * Update RekeningBulan by Id
 * @param  {String} options.id     UUID of RekeningBulan
 * @param  {Object} options.update Object containing field and value to be update
 * @return {Object}                Return Object containing status and or error object
 */
library.Update = async ({ id, update = {}, transactions = {} } = {}) => {
	try {
		let transaction = {};

    if (!id || _.isEmpty(update)) throw flaverr('E_BAD_REQUEST', Error(`id or update params not provided`));

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const rekeningBulan = await Rekening_Bulan.findOne({
			where: {
				id: id
			},
      ...transaction
		});

		if (!rekeningBulan) throw flaverr('E_NOT_FOUND', Error(`rekening bulan with ${id} not found`));

		Object.keys(update).forEach((key) => {
      if (key !== 'sum_bulan') if (update[key]) rekeningBulan[key] = update[key];
		});

		await rekeningBulan.save(transaction);

		return {
			status: true,
			data: rekeningBulan
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
 * UpdateSumCredit RekeningBulan
 * @param  {String} options.id          UUID of RekeningBulan
 * @param  {String} options.rekening_id UUID of Rekening
 * @param  {Number} options.bulan       Number of bulan
 * @param  {Number} options.tahun       Number of tahun
 * @param  {Number} nominal             Number of nominal
 * @param  {Object} transactions        Object of transactions
 * @return {Object}                     Return object containing status and or error object
 */
library.UpdateSumCredit = async ({
  id,
  rekening_id,
  bulan,
  tahun,
  nominal = 0.0,
  transactions = {}
} = {}) => {
  try {
    let transaction = {};
    let params = {};

    if (rekening_id && bulan && tahun) {
      params.rekening_id = rekening_id;
      params.tahun = tahun;
      params.bulan = bulan;
    }
    else if (id) {
      params.id = id;
    }
    else {
      throw flaverr('E_BAD_REQUEST', Error(`paramaters to find rekening bulan is not provided`));
    }

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let rekeningBulan = await library.FindOne({
      params,
      transactions: transaction.transaction
    });

    if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;

    if (nominal && typeof nominal !== 'number') {
      throw flaverr('E_BAD_REQUEST', Error(`nominal must be a number`));
    }

    rekeningBulan = rekeningBulan.data;

    rekeningBulan.sum_bulan -= Number.parseFloat(nominal);

    await rekeningBulan.save(transaction);

    const rekeningTahun = await rekeningTahunRepository.UpdateSumCredit({
      id: rekeningBulan.tahun_id,
      nominal: nominal,
      transactions: transaction.transaction
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;

    return {
      status: true,
      data: rekeningBulan
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
 * UpdateSumDebit RekeningBulan
 * @param  {String} options.id          UUID of RekeningBulan
 * @param  {String} options.rekening_id UUID of Rekening
 * @param  {Number} options.bulan       Number of bulan
 * @param  {Number} options.tahun       Number of tahun
 * @param  {Number} nominal             Nominal of debit
 * @param  {Object} transactions        Object of transactions
 * @return {Object}                     Return object containing status and or error object
 */
library.UpdateSumDebit = async ({
  id,
  rekening_id,
  bulan,
  tahun,
  nominal = 0.0 ,
  transactions = {}
} = {}) => {
  try {
    let transaction = {};
    let params = {};

    if (rekening_id && bulan && tahun) {
      params.rekening_id = rekening_id;
      params.tahun = tahun;
      params.bulan = bulan;
    }
    else if (id) {
      params.id = id;
    }
    else {
      throw flaverr('E_BAD_REQUEST', Error(`paramaters to find rekening bulan is not provided`));
    }

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let rekeningBulan = await library.FindOne({
      params,
      transactions: transaction.transaction
    });

    if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;

    if (nominal && typeof nominal !== 'number') {
      throw flaverr('E_BAD_REQUEST', Error(`nominal must be a number`));
    }

    rekeningBulan = rekeningBulan.data;

    rekeningBulan.sum_bulan += Number.parseFloat(nominal);

    await rekeningBulan.save(transaction);

    const rekeningTahun = await rekeningTahunRepository.UpdateSumDebit({
      id: rekeningBulan.tahun_id,
      nominal: nominal,
      transactions: transaction.transaction
    });

    if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;

    return {
      status: true,
      data: rekeningBulan
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
 * Find RekeningBulan by ID
 * @param  {String} id           UUID of RekeningBulan
 * @param  {Object} transactions Object of transaction
 * @return {Object}              Return object containing status and or error object
 */
library.FindById = async ({ id, transactions = {} } = {}) => {
	try {
		let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const rekeningBulan = await Rekening_Bulan.findOne({
      where: {
        id: id,
      },
      include: [{
        model: Rekening_Bulan,
        as: 'Next'
      }, {
        model: Rekening_Bulan,
        as: 'Previous'
      }, {
        model: Rekening
      }, {
        model: Rekening_Tahun
      }],
      ...transaction
    });

		if (!rekeningBulan) throw flaverr('E_NOT_FOUND', Error(`rekening bulan with id ${id} not found`));

		return {
			status: true,
			data: rekeningBulan
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
 * Find all RekeningBulan with filtering data
 * @param  {Object} options.params Object containing field and value to be filtering data
 * @param  {Object} pagination     Object containing page and per_page to paginate data
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindAll = async ({ params = {}, pagination = {}, transactions = {} } = {}) => {
  try {
    let where = {};

    let transaction = {};

    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 10;

    if (params.bulan) where.bulan = params.bulan;
    if (params.tahun) where.tahun = params.tahun;
    if (params.rekening_id) where.rekening_id = params.rekening_id;
    if (params.rekening_tahun_id) where.tahun_id = params.rekening_tahun_id;
    if (params.brand_id) where.brand_id = params.brand_id;

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const { count, rows } = await Rekening_Bulan.findAndCountAll({
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
 * FindOne RekeningBulan with filtering
 * @param  {Object} options.params Object containing field value for filtering
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindOne = async ({ params = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (_.isEmpty(params)) throw flaverr('E_BAD_REQUEST', Error(`params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const rekeningBulan = await Rekening_Bulan.findOne({
      where: {
        ...params
      },
      include: [{
        model: Rekening_Bulan,
        as: 'Next'
      }, {
        model: Rekening_Bulan,
        as: 'Previous'
      }, {
        model: Rekening
      }, {
        model: Rekening_Tahun
      }],
      ...transaction
    });

    if (!rekeningBulan) throw flaverr('E_NOT_FOUND', Error(`rekening bulan not found`));

    return {
      status: true,
      data: rekeningBulan
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
 * Destroy RekeningBulan by Id
 * @param  {String} options.id           UUID of RekeningBulan
 * @param  {Object} options.transactions Object of transaction
 * @return {Object}                      Return object containing status and or error object
 */
library.Destroy = async ({ id, transactions = {} }) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const rekeningBulan = await Rekening_Bulan.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!rekeningBulan) throw flaverr('E_NOT_FOUND', Error(`rekening bulan with id ${id} not found`));

    await rekeningBulan.destroy(transaction);

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
};

module.exports = library;
