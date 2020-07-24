const { Rekening, Jenis_Rekening, sequelize, Sequelize } = require('../../models');

const flaverr = require('flaverr');

const jenisRekeningRepository = require('./jenis_rekening');

const includeQuery = [
  {
    model: Jenis_Rekening,
    attributes: ['nama', 'nomor_jenis_rekening', 'sub_kelompok_id'],
  },
];

const saveRekening = async (data) => {
  try {
    const { jenis_rekening_id } = data;

    const checkJenisRekening = await jenisRekeningRepository.findOneJenisRekening(
      jenis_rekening_id
    );

    if (!checkJenisRekening.status) {
      throw checkJenisRekening.err;
    }

    const result = await sequelize.transaction(async (t) => {
      const rekening = await Rekening.create(data, {
        transaction: t,
      });
      return rekening;
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

const findAllRekenings = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const rekenings = await Rekening.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = rekenings;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('rekening not found'));
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

const findOneRekening = async (id) => {
  try {
    const rekening = await Rekening.findOne({
      where: {
        id,
      },
    });

    if (!rekening) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`rekening with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: rekening,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const updateRekening = async (id, data) => {
  try {
    const { nama, nomor_rekening } = data;
    const rekening = await findOneRekening(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    const result = await sequelize.transaction(async (t) => {
      rekening.data.nama = nama;
      rekening.data.nomor_rekening = nomor_rekening;

      await rekening.data.save({ transaction: t });
      return rekening.data;
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

const destroyRekening = async (id) => {
  try {
    const rekening = await findOneRekening(id);

    if (!rekening.status) {
      throw rekening.err;
    }

    // delete
    await rekening.data.destroy();

    return {
      status: true,
      data: rekening.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  saveRekening,
  findAllRekenings,
  findOneRekening,
  updateRekening,
  destroyRekening,
};
