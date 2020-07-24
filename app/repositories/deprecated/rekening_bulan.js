const {
  Rekening_Bulan,
  Rekening_Tahun,
  sequelize,
  Sequelize,
} = require('../../models');

const periodeRekeningTahunRepo = require('./rekening_tahun');

const flaverr = require('flaverr');

const includeQuery = [
  {
    model: Rekening_Bulan,
    as: 'Next',
    attributes: ['periode', 'saldo_rekening'],
  },
  {
    model: Rekening_Bulan,
    as: 'Previous',
    attributes: ['periode', 'saldo_rekening'],
  },
  {
    model: Rekening_Tahun,
    attributes: ['year', 'saldo', 'rekening_id'],
  },
];

const savePeriodeRekeningBulan = async (data) => {
  try {
    const { rekening_tahun_id } = data;

    // check id
    const check = await periodeRekeningTahunRepo.findOneRekeningTahun(
      rekening_tahun_id
    );

    if (!check.status) {
      throw check.err;
    }

    const result = await sequelize.transaction(async (t) => {
      const periodeRekeningBulan = await Rekening_Bulan.create(data, {
        transaction: t,
      });
      return periodeRekeningBulan;
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

const findAllPeriodeRekeningBulans = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const periodeRekeningBulans = await Rekening_Bulan.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = periodeRekeningBulans;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('periode_rekening_bulan not found'));
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

const findOnePeriodeRekeningBulan = async (id) => {
  try {
    const periodeRekeningBulan = await Rekening_Bulan.findOne({
      where: {
        id,
      },
    });

    if (!periodeRekeningBulan) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`periode_rekening_bulan with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: periodeRekeningBulan,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updatePeriodeRekeningBulan = async (id, data) => {
  try {
    const { periode, saldo_rekening } = data;
    const periodeRekeningBulan = await findOnePeriodeRekeningBulan(id);

    if (!periodeRekeningBulan.status) {
      throw periodeRekeningBulan.err;
    }

    // update
    const result = await sequelize.transaction(async (t) => {
      periodeRekeningBulan.data.periode = periode;
      periodeRekeningBulan.data.saldo_rekening = saldo_rekening;

      await periodeRekeningBulan.data.save({ transaction: t });
      return periodeRekeningBulan.data;
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

const destroyPeriodeRekeningBulan = async (id) => {
  try {
    const periodeRekeningBulan = await findOnePeriodeRekeningBulan(id);

    if (!periodeRekeningBulan.status) {
      throw periodeRekeningBulan.err;
    }

    // delete
    await periodeRekeningBulan.data.destroy();

    return {
      status: true,
      data: periodeRekeningBulan.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  savePeriodeRekeningBulan,
  findAllPeriodeRekeningBulans,
  findOnePeriodeRekeningBulan,
  updatePeriodeRekeningBulan,
  destroyPeriodeRekeningBulan,
};
