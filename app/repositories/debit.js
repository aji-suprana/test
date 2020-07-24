const { Debit, Rekening, Rekening_Bulan, Jurnal_Umum, Sequelize, sequelize } = require('../models');
const rekeningBulanRepository = require('./rekening_bulan');
const _ = require('lodash');
const flaverr = require('flaverr');
var library = {};

/**
 * Create Debit
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

    let debitData = {
      nominal,
      jurnal_umum_id,
      rekening_bulan_id,
      rekening_id,
      brand_id
    };

    const debit = await Debit.create(debitData, {...transaction});

    if (!debit) throw flaverr('E_BAD_REQUEST', Error(`failed to create debit`));

    const updateRekeningBulan = await rekeningBulanRepository.UpdateSumDebit({
      id: rekening_bulan_id,
      nominal: nominal,
      transactions: transaction.transaction
    });

    if (!updateRekeningBulan.status && updateRekeningBulan.err) throw updateRekeningBulan.err;

    return {
      status: true,
      data: debit
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
 * Update Debit
 * @param  {String} options.id     UUID of Debit
 * @param  {Object} options.update Object containing field and value to be update
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.Update = async ({ id, update = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id || _.isEmpty(update)) throw flaverr('E_BAD_REQUEST', Error(`id or update params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let oldDebit = await Debit.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!oldDebit) throw flaverr('E_NOT_FOUND', Error(`debit with id ${id} not found`));

    if (update.nominal) {
      if (typeof update.nominal !== 'number') {
        throw flaverr('E_BAD_REQUEST', Error(`nominal must be a number`));
      }

      let difference = Number.parseFloat(update.nominal) - oldDebit.nominal;

      const updateRekeningBulan = await rekeningBulanRepository.UpdateSumDebit({
        id: oldDebit.rekening_bulan_id,
        nominal: difference,
        transactions: transaction.transaction
      });

      if (!updateRekeningBulan.status && updateRekeningBulan.err) throw updateRekeningBulan.err;

      const jurnalUmumRepository = require('./jurnal_umum');

      let jurnalUmum = await jurnalUmumRepository.FindOne({
        params: {
          id: oldDebit.jurnal_umum_id
        },
        transactions: transaction.transaction
      });

      if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

      jurnalUmum.data.selisih_debet_kredit_total += difference;

      await jurnalUmum.data.save(transaction);

      oldDebit.nominal = update.nominal;
    }

    Object.keys(update).forEach((key) => {
      if (key !== 'nominal') if (update[key]) oldDebit[key] = update[key];
    });

    await oldDebit.save(transaction);

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
 * FindOne Debit with parameter
 * @param  {Object} options.params Object containing field and value to be parameter
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindOne = async ({ params = {}, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (_.isEmpty(params)) throw flaverr('E_BAD_REQUEST', Error(`params not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transaction;

    const debit = await Debit.findOne({
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

    if (!debit) throw flaverr('E_NOT_FOUND', Error(`debit not found`));

    return {
      status: true,
      data: debit
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
 * Find Debit by Id
 * @param  {String} id           UUID of Debit
 * @param  {Object} transactions Object of transaction
 * @return {Object}              Return object containing status and or error
 */
library.FindById = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const debit = await Debit.findOne({
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

    if (!debit) throw flaverr('E_NOT_FOUND', Error(`debit with id ${id} not found`));

    return {
      status: true,
      data: debit
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
 * Find all Debit with filtering data
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

    const { count, rows } = await Debit.findAndCountAll({
      where: where,
      offset: (page - 1) * per_page,
      limit: per_page,
      ...transaction
    });

    if (count < 1) throw flaverr('E_NOT_FOUND', Error(`debit not found`));

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
 * Destroy Debit
 * @param  {String} options.id           UUID of Debit
 * @param  {Object} options.transactions object of transactions
 * @return {Object}                      Return object containing status and or error object
 */
library.Destroy = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const debit = await Debit.findOne({
      where: {
        id: id
      },
      ...transaction
    });

    if (!debit) throw flaverr('E_NOT_FOUND', Error(`debit with id ${id} not found`));

    const updateSumDebit = await rekeningBulanRepository.UpdateSumDebit({
      id: debit.rekening_bulan_id,
      nominal: -1 * debit.nominal,
      transactions: transaction.transaction
    });

    if (!updateSumDebit.status && updateSumDebit.err) throw updateSumDebit.err;

    const jurnalUmumRepository = require('./jurnal_umum');

    let jurnalUmum = await jurnalUmumRepository.FindOne({
      params: {
        id: debit.jurnal_umum_id
      },
      transactions: transaction.transaction
    });

    if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

    jurnalUmum.data.selisih_debet_kredit_total += (-1 * debit.nominal);

    await jurnalUmum.data.save(transaction);

    await debit.destroy(transaction);

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
