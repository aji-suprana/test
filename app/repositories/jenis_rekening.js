const flaverr = require('flaverr');

const {
  Jenis_Rekening,
  Sub_Kelompok,
  sequelize,
  Sequelize,
} = require('../models');
const subKelompokRepository = require('./sub_kelompok');

const includeQuery = [
  {
    model: Sub_Kelompok,
    attributes: ['nama', 'nomor_sub_kelompok', 'kelompok_id'],
  },
];

const Create = async (data) => {
  try {
    const { sub_kelompok_id } = data;

    const checkSubKelompok = await subKelompokRepository.FindOne(
      sub_kelompok_id
    );

    if (!checkSubKelompok.status) {
      throw checkSubKelompok.err;
    }

    // create
    const result = await sequelize.transaction(async (t) => {
      const jenisRekening = await Jenis_Rekening.create(data, {
        transaction: t,
      });
      return jenisRekening;
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

const FindMany = async (params, pagination) => {
  try {
    const page = pagination.page || 1;
    const per_page = pagination.per_page || 20;

    // jika ada params
    const where = {};

    // ambil data untuk pagination
    const jenisRekenings = await Jenis_Rekening.findAndCountAll({
      offset: (page - 1) * page,
      limit: per_page,
      include: includeQuery,
    });

    const { count, rows } = jenisRekenings;

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('jenis_rekening not found'));
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

const FindOne = async (id) => {
  try {
    const jenisRekening = await Jenis_Rekening.findOne({
      where: {
        id,
      },
      include: includeQuery,
    });

    if (!jenisRekening) {
      throw flaverr(
        'E_NOT_FOUND',
        Error(`jenis_rekening with id ${id} is not found`)
      );
    }

    return {
      status: true,
      data: jenisRekening,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

const Update = async (id, data) => {
  try {
    const { nama, nomor_jenis_rekening } = data;
    const jenisRekening = await FindOne(id);

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    const result = await sequelize.transaction(async (t) => {
      jenisRekening.data.nama = nama;
      jenisRekening.data.nomor_jenis_rekening = nomor_jenis_rekening;

      await jenisRekening.data.save({ transaction: t });
      return jenisRekening.data;
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

const Delete = async (id) => {
  try {
    const jenisRekening = await FindOne(id);

    if (!jenisRekening.status) {
      throw jenisRekening.err;
    }

    // delete
    await jenisRekening.data.destroy();

    return {
      status: true,
      data: jenisRekening.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  Create,
  FindMany,
  FindOne,
  Update,
  Delete,
};
