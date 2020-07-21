const { sequelize, Sequelize } = require('../models');

/**
 * Create Object Transaction
 */

const Create = async () => {
  try {
    const transaction = await sequelize.transaction({
      isolationLevel:
        Sequelize.Transaction.READ_UNCOMMITTED || 'READ UNCOMMITTED',
    });

    return {
      status: true,
      data: transaction,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Rollback Transaction
 * @param {Object} transaction Object transaction
 */

const Rollback = async (transaction) => {
  try {
    await transaction.rollback();

    return {
      status: true,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Commit Transaction
 * @param {Object} transaction Object transaction
 */

const Commit = async (transaction) => {
  try {
    await transaction.commit();

    return {
      status: true,
    };
  } catch (err) {
    await Rollback(transaction);

    return {
      status: false,
      err: err,
    };
  }
};

module.exports = { Create, Rollback, Commit };
