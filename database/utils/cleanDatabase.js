const db = require('../../app/models');
/**
 * Cleaning up data in database
 * @return {Promise<void>} Promise resolved or rejected without any return data
 */
const cleanUpDatabase = async () => {
  await db.Credit.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });

  await db.Debit.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });

  await db.Jurnal_Umum.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });

  await db.Rekening_Bulan.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });

  await db.Rekening_Tahun.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });

  await db.Rekening.destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true
    }
  });
};

module.exports = {
  cleanUpDatabase
};
