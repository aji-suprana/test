const {
  Credit,
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

const saveCredit = async (data) => {
  try {
    const { jurnal_umum_id, rekening_bulan_id, rekening_id } = data;

    const checkAllIDs = await checkLocalIDs(
      [{ jurnal_umum_id, rekening_bulan_id, rekening_id }],
      [Jurnal_Umum, Rekening_Bulan, Rekening]
    );

    if (!checkAllIDs.status) {
      throw checkAllIDs.err;
    }

    // TODO: hutang service
    const hutang_id = {};

    const result = await sequelize.transaction(async (t) => {
      const credit = await Credit.create(data, { transaction: t });
      return credit;
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

const findAllCredits = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const credits = await Credit.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = credits;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('credit not found'));
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

const findOneCredit = async (id) => {
  try {
    const credit = await Credit.findOne({
      where: {
        id,
      },
    });

    if (!credit) {
      throw flaverr('E_NOT_FOUND', Error(`credit with id ${id} is not found`));
    }

    return {
      status: true,
      data: credit,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateCredit = async (id, data) => {
  try {
    const { nominal } = data;

    const credit = await findOneCredit(id);

    if (!credit.status) {
      throw credit.err;
    }

    const result = await sequelize.transaction(async (t) => {
      credit.data.nominal = nominal;

      await credit.data.save({ transaction: t });
      return credit.data;
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

const destroyCredit = async (id) => {
  try {
    const credit = await findOneCredit(id);

    if (!credit.status) {
      throw credit.err;
    }

    // delete
    await credit.data.destroy();

    return {
      status: true,
      data: credit.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveCredit,
  findAllCredits,
  findOneCredit,
  updateCredit,
  destroyCredit,
};
