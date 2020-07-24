const { Jurnal_Umum, Debit, Credit, Rekening_Bulan, Sequelize } = require('../models');
const rekeningBulanRepository = require('./rekening_bulan');
const rekeningTahunRepository = require('./rekening_tahun');
const creditRepository = require('./credit');
const debitRepository = require('./debit');
const flaverr = require("flaverr");
const _ = require('lodash');
var library = {}

/**
 * Create JurnalUmum
 * @param  {String} options.tanggal       String tanggal with format YYYY-MM-DD
 * @param  {String} options.nomor_invoice Nomor invoice for JurnalUmum
 * @param  {String} options.modul         Modul
 * @param  {String} options.brand_id      UUID of Brand
 * @param  {Array}  options.debits        Array containing object of debit
 * @param  {Array}  options.credits       Array containing object of credit
 * @param  {Object} options.transactions  Object of transaction
 * @return {Object}                       Return object containing status and or error object
 */
library.Create = async ({
	tanggal,
	nomor_invoice,
	modul,
	brand_id,
	debits = [],
	credits = [],
  transactions = {}
} = {}) => {
	try {
    let transaction = {};

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    tanggal = new Date(tanggal);

		const sumDebit = debits.reduce((acc, curr) => {
			return acc + curr.nominal
		}, 0);

		const sumKredit = credits.reduce((acc, curr) => {
			return acc + curr.nominal
		}, 0);

		const selisih_debet_kredit_total = sumDebit - sumKredit;

		const jurnalUmum = await Jurnal_Umum.create({
			tanggal: tanggal,
			nomor_invoice: nomor_invoice,
			selisih_debet_kredit_total: selisih_debet_kredit_total,
			modul: modul,
			brand_id: brand_id
		}, {...transaction});

		if (!jurnalUmum) throw flaverr('E_ERROR', Error('failed to create jurnal umum'));

    for (let credit of credits ) {
      let rekeningTahun = await rekeningTahunRepository.FindOne({
        params: {
          rekening_id: credit.rekening,
          tahun: tanggal.getFullYear()
        },
        transactions: transaction.transaction
      });

      if (!rekeningTahun.status && rekeningTahun.err) {
        rekeningTahun = await rekeningTahunRepository.Create({
          tahun: tanggal.getFullYear(),
          rekening_id: credit.rekening,
          brand_id: brand_id,
          transactions: transaction.transaction
        });

        if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;
      }

      rekeningTahun = rekeningTahun.data;

      let rekeningBulan = await rekeningBulanRepository.FindOne({
        params: {
          rekening_id: credit.rekening,
          tahun_id: rekeningTahun.id
        },
        transactions: transaction.transaction
      });

      if (!rekeningBulan.status && rekeningBulan.err) {
        rekeningBulan = await rekeningBulanRepository.Create({
          bulan: tanggal.getMonth() + 1,
          tahun: tanggal.getFullYear(),
          rekening_id: credit.rekening,
          brand_id: brand_id,
          tahun_id: rekeningTahun.id,
          transactions: transaction.transaction
        });

        if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;
      }

      rekeningBulan = rekeningBulan.data;

      credit.jurnal_umum_id = jurnalUmum.id;
      credit.rekening_bulan_id = rekeningBulan.id;
      credit.rekening_id = credit.rekening;
      credit.nominal = credit.nominal;
      credit.brand_id = brand_id;

      const createCredit = await creditRepository.Create({
        ...credit,
        transactions: transaction.transaction
      });

      if (!createCredit.status && createCredit.err) throw createCredit.err;
    }

    for (let debit of debits ) {
      let rekeningTahun = await rekeningTahunRepository.FindOne({
        params: {
          rekening_id: debit.rekening,
          tahun: tanggal.getFullYear()
        },
        transactions: transaction.transaction
      });

      if (!rekeningTahun.status && rekeningTahun.err) {
        rekeningTahun = await rekeningTahunRepository.Create({
          tahun: tanggal.getFullYear(),
          rekening_id: debit.rekening,
          brand_id: brand_id,
          transactions: transaction.transaction,
        });

        if (!rekeningTahun.status && rekeningTahun.err) throw rekeningTahun.err;
      }

      rekeningTahun = rekeningTahun.data;

      let rekeningBulan = await rekeningBulanRepository.FindOne({
        params: {
          rekening_id: debit.rekening,
          tahun_id: rekeningTahun.id
        },
        transactions: transaction.transaction
      });

      if (!rekeningBulan.status && rekeningBulan.err) {
        rekeningBulan = await rekeningBulanRepository.Create({
          bulan: tanggal.getMonth() + 1,
          tahun: tanggal.getFullYear(),
          rekening_id: debit.rekening,
          brand_id: brand_id,
          tahun_id: rekeningTahun.id,
          transactions: transaction.transaction
        });

        if (!rekeningBulan.status && rekeningBulan.err) throw rekeningBulan.err;
      }

      rekeningBulan = rekeningBulan.data;

      debit.jurnal_umum_id = jurnalUmum.id;
      debit.rekening_bulan_id = rekeningBulan.id;
      debit.rekening_id = debit.rekening;
      debit.nominal = debit.nominal;
      debit.brand_id = brand_id;

      const createDebit = await debitRepository.Create({
        ...debit,
        transactions: transaction.transaction
      });

      if (!createDebit.status && rekeningBulan.err) throw rekeningBulan.err;
    }

		return {
			status: true,
			data: jurnalUmum
		};
	}
	catch (err) {
		return {
			status: false,
			err: err
		};
	}
};

/** Update JurnalUmum
 * @param  {String} options.id            UUID of JurnalUmum
 * @param  {String} options.nomor_invoice Nomor Invoice of JurnalUmum
 * @param  {Object} options.update        Object containing field to be update
 * @param  {Object} transactions          Object of transaction
 * @return {Object}                       Return object of data and or error object
 */
library.Update = async ({ id, nomor_invoice, update = {}, transactions = {} } = {}) => {
	try {
		let where = {};
    let transaction = {};

    if (!id && !nomor_invoice) {
      throw flaverr('E_BAD_REQUEST', Error(`id or nomor invoice not provided`));
    }

    if (_.isEmpty(update)) throw flaverr('E_BAD_REQUEST', Error(`update params not provided`));

		if (id) where.id = id;
		if (nomor_invoice) where.nomor_invoice = nomor_invoice;

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const jurnalUmum = await Jurnal_Umum.findOne({
			where: where,
      ...transaction
		});

    if (!jurnalUmum) throw flaverr('E_NOT_FOUND', Error(`jurnal umum with id ${id} not found`));

		Object.keys(update).forEach((key) => {
      if (key === 'tanggal') {
        let tanggal = new Date(update[key]);
        jurnalUmum[key] = tanggal;
      }

      if (update[key]) jurnalUmum[key] = update[key];
    });

    await jurnalUmum.save(transaction);

		return {
			status: true,
			data: jurnalUmum
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
 * Destroy JurnalUmum by Id
 * @param  {String} options.id           UUID of JurnalUmum
 * @param  {Object} options.transactions Object of transaction
 * @return {Object}                      Return object containing status and or error object
 */
library.Destroy = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    let jurnalUmum = await library.FindById({
      id: id,
      transactions: transaction.transaction
    });

    if (!jurnalUmum.status && jurnalUmum.err) throw jurnalUmum.err;

    jurnalUmum = jurnalUmum.data;

    for (let credit of jurnalUmum.Credits) {
      const deleteCredit = await creditRepository.Destroy({
        id: credit.id,
        transactions: transaction.transaction
      });

      if (!deleteCredit.status && deleteCredit.err) throw deleteCredit.err;
    }

    for (let debit of jurnalUmum.Debits) {
      const deleteDebit = await debitRepository.Destroy({
        id: debit.id,
        transactions: transaction.transaction
      });

      if (!deleteDebit.status && deleteDebit.err) throw deleteDebit.err;
    }

    await jurnalUmum.destroy(transaction);

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
 * Find JurnalUmum with filter data
 * @param  {Object} options.params Object containing field and value to filter data
 * @param  {Object} pagination     Object containing page and per_page for pagination
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindAll = async ({ params = {}, pagination = {}, transactions = {} } = {}) => {
  try {
    let where = {};

    let transaction = {};

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const page = pagination.page ? Number.parseInt(pagination.page) : 1;
    const per_page = pagination.per_page ? Number.parseInt(pagination.per_page) : 10;

    if (params.nomor_invoice) where.nomor_invoice = { [Sequelize.Op.like]: `%${params.nomor_invoice}%` }
    if (params.modul) where.modul = { [Sequelize.Op.like]: `%${params.modul}%` }
    if (params.start_date) where.tanggal = { [Sequelize.Op.gte]: new Date(params.start_date) }
    if (params.end_date) where.tanggal = { [Sequelize.Op.lte]: new Date(params.end_date) }
    if (params.brand_id)  where.brand_id = { [Sequelize.Op.eq]: params.brand_id }

    let { count, rows } = await Jurnal_Umum.findAndCountAll({
      where: where,
      offset: (page - 1) * per_page,
      limit: per_page,
      ...transaction
    });

    if (count < 1) throw flaverr('E_NOT_FOUND', Error(`jurnal umum not found`));

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
 * FindOne JurnalUmum with criteria
 * @param  {Object} options.params Object containing field value for criteria
 * @param  {Object} transactions   Object of transaction
 * @return {Object}                Return object containing status and or error object
 */
library.FindOne = async ({ params = {}, transactions = {} } = {}) => {
	try {
		let transaction = {};

    if(_.isEmpty(params)) throw flaverr('E_BAD_REQUEST', Error(`params not provided`));

		if (!_.isEmpty(transactions)) transaction.transaction = transactions;

		const jurnalUmum = await Jurnal_Umum.findOne({
			where: {
        ...params
      },
			include: [
				{
					model: Debit
				},
				{
					model: Credit
				}
			],
      ...transaction
		});

    if (!jurnalUmum) throw flaverr('E_NOT_FOUND', Error(`jurnal umum not found`));

    return {
      status: true,
      data: jurnalUmum
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
 * Find JurnalUmum by Id
 * @param  {String} options.id    UUID of JurnalUmum
 * @param  {Object} transactions  Object of transaction
 * @return {Object}               Return object containing status and or error object
 */
library.FindById = async ({ id, transactions = {} } = {}) => {
  try {
    let transaction = {};

    if (!id) throw flaverr('E_BAD_REQUEST', Error(`id not provided`));

    if (!_.isEmpty(transactions)) transaction.transaction = transactions;

    const jurnalUmum = await Jurnal_Umum.findOne({
      where: {
        id: id
      },
      include: [
        {
          model: Debit
        },
        {
          model: Credit
        }
      ],
      ...transaction
    });

    if (!jurnalUmum) throw flaverr('E_NOT_FOUND', Error(`jurnal umum with id ${id} not found`));

    return {
      status: true,
      data: jurnalUmum
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
