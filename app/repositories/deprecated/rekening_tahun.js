const { Rekening_Tahun, Rekening, sequelize, Sequelize } = require('../../models');

const flaverr = require('flaverr');

const findOrCreateRekeningTahun = async (data) => {
  try {
    const { tahun, rekening_id, brand_id } = data;

    const where = {};
    where.tahun = { [Sequelize.Op.eq]: tahun };
    where.rekening_id = { [Sequelize.Op.eq]: rekening_id };

    const checkRekeningTahun = await Rekening_Tahun.findOne({
      where: where,
    });

    let rekeningTahun;
    if (checkRekeningTahun) {
      rekeningTahun = checkRekeningTahun;
    } else {
      const [prevTahun] = await findOrCreateRekeningTahun({
        saldo_awal: 0,
        sum_tahun: 0,
        tahun: tahun - 1,
        rekening_id,
        brand_id,
      });
      const [nextTahun] = await findOrCreateRekeningTahun({
        saldo_awal: 0,
        sum_tahun: 0,
        tahun: tahun + 1,
        rekening_id,
        brand_id,
      });

      const rekeningTahunData = {
        saldo_awal: 0,
        sum_tahun: 0,
        tahun,
        rekening_id,
        brand_id,
      };
    }

    return {
      status: true,
      data: rekeningTahun,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = {
  findOrCreateRekeningTahun,
};
