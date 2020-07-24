const { Jurnal_Umum, Rekening, sequelize, Sequelize } = require('../../models');
const checkLocalIDs = require('../../services/checkLocalIDs');

const flaverr = require('flaverr');

const debitRepository = require('./debit');
const creditRepository = require('./credit');

const saveJurnalUmum = async (data) => {
  try {
    const { tanggal, nomor_invoice, modul, debit, credit } = data;

    const debitRekening = debit.map((item) => item.rekening_id);
    const creditRekening = credit.map((item) => item.rekening_id);

    // check rekening in debit
    for (const item of debitRekening) {
      const checkDebitRekening = await checkLocalIDs(
        [{ debitRekening: item }],
        [Rekening]
      );

      if (!checkDebitRekening.status) {
        throw checkDebitRekening.err;
      }
    }

    // check rekening in credit
    for (const item of creditRekening) {
      const checkCreditRekening = await checkLocalIDs(
        [{ creditRekening: item }],
        [Rekening]
      );

      if (!checkCreditRekening.status) {
        throw checkCreditRekening.err;
      }
    }

    // sum debit nominal
    const sumDebitNominal = debit.reduce((acc, curr) => {
      return acc.nominal + curr.nominal;
    });

    // sum credit nominal
    const sumCreditNominal = credit.reduce((acc, curr) => {
      return acc.nominal + curr.nominal;
    });

    const selisih_debet_kredit_total = Math.abs(
      sumDebitNominal - sumCreditNominal
    );

    const result = await sequelize.transaction(async (t) => {
      const jurnalUmumData = {
        tanggal,
        nomor_invoice,
        modul,
        selisih_debet_kredit_total,
      };

      const jurnalUmum = await Jurnal_Umum.create(jurnalUmumData, {
        transaction: t,
      });

      // create debit
      // TODO: kerjain rekening tahun & bulan dulu
      const debit = debit.map(async (item) => {
        const debitData = {
          jurnal_umum_id: jurnalUmum.id,
          rekening_id: item.rekening_id,
          nominal: item.nominal,
        };

        const createDebit = await debitRepository.saveDebit();
      });

      return jurnalUmum;
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const findAllJurnalUmums = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const jurnalUmums = await Jurnal_Umum.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
    });

    const { count, rows } = jurnalUmums;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jurnal_umum not found'));
    }

    const result = paginate({
      data: rows,
      count,
      page,
      per_page,
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const findOneJurnalUmum = async (id) => {
  try {
    const jurnalUmum = await Jurnal_Umum.findOne({
      where: {
        id,
      },
    });

    if (!jurnalUmum) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`jurnal_umum with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: jurnalUmum,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateJurnalUmum = async (id, data) => {
  try {
    const { tanggal, keterangan, selisih_debet_kredit_total, modul } = data;
    const jurnalUmum = await findOneJurnalUmum(id);

    if (!jurnalUmum.status) {
      throw jurnalUmum.err;
    }

    const result = await sequelize.transaction(async (t) => {
      jurnalUmum.data.tanggal = tanggal;
      jurnalUmum.data.keterangan = keterangan;
      jurnalUmum.data.selisih_debet_kredit_total = selisih_debet_kredit_total;
      jurnalUmum.data.modul = modul;

      await jurnalUmum.data.save({ transaction: t });
      return jurnalUmum.data;
    });

    return {
      status: true,
      data: result,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const destroyJurnalUmum = async (id) => {
  try {
    const jurnalUmum = await findOneJurnalUmum(id);

    if (!jurnalUmum.status) {
      throw jurnalUmum.err;
    }

    // delete
    await jurnalUmum.data.destroy();

    return {
      status: true,
      data: jurnalUmum.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveJurnalUmum,
  findAllJurnalUmums,
  findOneJurnalUmum,
  updateJurnalUmum,
  destroyJurnalUmum,
};
