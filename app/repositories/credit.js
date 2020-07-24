const { Credit, Rekening, Rekening_Bulan, Jurnal_Umum, Sequelize, sequelize } = require('../models');
const rekeningBulanRepository = require('./rekening_bulan');
const _ = require('lodash');
const flaverr = require('flaverr');
var library = {}

/**
 * Create Credit
 * @param  {Number} options.nominal           Number of nominal
 * @param  {String} options.jurnal_umum_id    UUID of JurnalUmum
 * @param  {String} options.rekening_bulan_id UUID of RekeningBulan
 * @param  {String} options.rekening_id       UUID of Rekening
 * @param  {String} options.brand_id          UUID of Brand
 * @param  {Object} options.transactions      Object of transaction
 * @return {Object}                           Return object containing status and or error
 */
library.Create = async ({
  nominal = 0.0,
  jurnal_umum_id,
  rekening_bulan_id,
  rekening_id,
  brand_id,
  transactions = {}
} = {}) => {
  try {
    let transaction = {};

    if(!_.isEmpty(transactions)) transaction.transaction = transactions;

    let creditData = {
      nominal,
      jurnal_umum_id,
      rekening_bulan_id,
      rekening_id,
      brand_id
    };

    const credit = await Credit.create(creditData, {...transaction});

    if (!credit) throw flaverr('E_ERROR', Error(`failed to create credit`));

    const updateRekeningBulan = await rekeningBulanRepository.UpdateSumCredit({
      id: rekening_bulan_id,
      nominal: nominal,
      transactions: transaction.transaction
    });

    if (!updateRekeningBulan.status && updateRekeningBulan.err) throw updateRekeningBulan.err;

    return {
      status: true,
      data: credit
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
 * Update Credit
 * @param  {String} options.id     UUID of Credit
 * @param  {Object} options.update Object containing field and value to be update
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.Update = async ({ id, update = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id || _.isEmpty(update)) throw flaverr('E_BAD_REQUEST', Error(`id or update params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let oldCredit = await Credit.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!oldCredit) throw flaverr('E_NOT_FOUND', Error(`credit with id ${id} not found`));

    if (update.nominal) {
      if (typeof update.nominal !== 'number') {
        throw flaverr('E_BAD_REQUEST', Error(`nominal must be a number`));
      }

      let difference = Number.parseFloat(update.nominal) - oldCredit.nominal;

      const updateRekeningBulan = await rekeningBulanRepository.UpdateSumCredit({
        id: oldCredit.rekening_bulan_id,
        nominal: difference,
        transactions: transaction.transaction
      });

      if (!updateRekeningBulan.status && updateRekeningBulan.err) throw updateRekeningBulan.err;

      const jurnalUmumRepository = require('./jurnal_umum');

      let jurnalUmum = await jurnalUmumRepository.FindOne({
        params: {
          id: oldCredit.jurnal_umum_id
        },
        transactions: transaction.transaction
      });

      if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

      jurnalUmum.data.selisih_debet_kredit_total -= difference;

      await jurnalUmum.data.save(transaction);

      oldCredit.nominal = update.nominal;
    }

    Object.keys(update).forEach((key) => {
      if (key !== 'nominal') if (update[key]) oldCredit[key] = update[key];
    });

    await oldCredit.save(transaction);

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

/**
 * FindOne Credit with parameter
 * @param  {Object} options.params Object containing field and value to be parameter
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindOne = async ({ params = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (_.isEmpty(params)) throw flaverr('E_BAD_REQUEST', Error(`params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transaction;

    const credit = await Credit.findOne({
      where: {
        ...params
      },
      include: [{
        model: Rekening
      }, {
        model: Rekening_Bulan
      }, {
        model: Jurnal_Umum
      }],
      ...transaction
    });

    if (!credit) throw flaverr('E_NOT_FOUND', Error(`credit not found`));

    return {
      status: true,
      data: credit
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
 * Find Credit by Id
 * @param  {String} id           UUID of Credit
 * @param  {Object} transactions Object of transaction
 * @return {Object}              Return object containing status and or error
 */
library.FindById = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const credit = await Credit.findOne({
      where: {
        id: id
      },
      include: [{
        model: Rekening
      }, {
        model: Rekening_Bulan
      }, {
        model: Jurnal_Umum
      }],
      ...transaction
    });

    if (!credit) throw flaverr('E_NOT_FOUND', Error(`credit with id ${id} not found`));

    return {
      status: true,
      data: credit
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
 * Find all Credit with filtering data
 * @param  {Object} options.params Object containing field and value to filter data
 * @param  {Object} pagination     Object containig page and per_page to paginate
 * @param  {Object} transactions   Object of tansaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindAll = async ({ params = {}, pagination = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};
    let where = {};

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    if (params.jurnal_umum_id) where.jurnal_umum_id = { [Sequelize.Op.eq]: params.jurnal_umum_id }
    if (params.rekening_id) where.rekening_id = { [Sequelize.Op.eq]: params.rekening_id }
    if (params.rekening_bulan_id) where.rekening_bulan_id = { [Sequelize.Op.eq]: params.rekening_bulan_id }
    if (params.brand_id) where.brand_id = { [Sequelize.Op.eq]: params.brand_id }

    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 10;

    const { count, rows } = await Credit.findAndCountAll({
      where: where,
      offset: (page - 1) * per_page,
      limit: per_page,
      ...transaction
    });

    if (count < 1) throw flaverr('E_NOT_FOUND', Error(`credit not found`));

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
 * Destroy Credit
 * @param  {String} options.id           UUID of Credit
 * @param  {Object} options.transactions object of transactions
 * @return {Object}                      Return object containing status and or error object
 */
library.Destroy = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const credit = await Credit.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!credit) throw flaverr('E_NOT_FOUND', Error(`credit with id ${id} not found`));

    const updateSumCredit = await rekeningBulanRepository.UpdateSumCredit({
      id: credit.rekening_bulan_id,
      nominal: -1 * credit.nominal,
      transactions: transaction.transaction
    });

    if (!updateSumCredit.status && updateSumCredit.err) throw updateSumCredit.err;

    const jurnalUmumRepository = require('./jurnal_umum');

    let jurnalUmum = await jurnalUmumRepository.FindOne({
      params: {
        id: credit.jurnal_umum_id
      },
      transactions: transaction.transaction
    });

    if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

    jurnalUmum.data.selisih_debet_kredit_total -= (-1 * credit.nominal);

    await jurnalUmum.data.save(transaction);

    await credit.destroy(transaction);

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
