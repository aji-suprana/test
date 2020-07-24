const {
  Debit,
  Jurnal_Umum,
  Rekening_Bulan,
  Rekening,
  sequelize,
  Sequelize,
} = require('../../models');
const checkLocalIDs = require('../../services/checkLocalIDs');

const flaverr = require('flaverr');

const includeQuery = [
  {
    model: Jurnal_Umum,
    attributes: [
      'tanggal',
      'keterangan',
      'selisih_debet_kredit_total',
      'modul',
    ],
  },
  {
    model: Rekening_Bulan,
    attributes: ['periode', 'saldo_rekening'],
  },
  {
    model: Rekening,
    attributes: ['nama', 'nomor_rekening'],
  },
];

const saveDebit = async (data) => {
  try {
    const { jurnal_umum_id, rekening_bulan_id, rekening_id } = data;

    const checkAllIDs = await checkLocalIDs(
      [{ jurnal_umum_id, rekening_bulan_id, rekening_id }],
      [Jurnal_Umum, Rekening_Bulan, Rekening]
    );

    if (!checkAllIDs.status) {
      throw checkAllIDs.err;
    }

    // TODO: check piutang
    const checkPiutang = {};

    const result = await sequelize.transaction(async (t) => {
      const debit = await Debit.create(data, { transaction: t });
      return debit;
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

const findAllDebits = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const debits = await Debit.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = debits;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('debit not found'));
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

const findOneDebit = async (id) => {
  try {
    const debit = await Debit.findOne({
      where: {
        id,
      },
    });

    if (!debit) {
      throw flaverr('E_NOT_FOUND', Error(`debit with id ${id} is not found`));
    }

    return {
      status: true,
      data: debit,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateDebit = async (id, data) => {
  try {
    const { nominal } = data;

    const debit = await findOneDebit(id);

    if (!debit.status) {
      throw debit.err;
    }

    const result = await sequelize.transaction(async (t) => {
      debit.data.nominal = nominal;

      await debit.data.save({ transaction: t });
      return debit.data;
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

const destroyDebit = async (id) => {
  try {
    const debit = await findOneDebit(id);

    if (!debit.status) {
      throw debit.err;
    }

    // delete
    await debit.data.destroy();

    return {
      status: true,
      data: debit.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveDebit,
  findAllDebits,
  findOneDebit,
  updateDebit,
  destroyDebit,
};
