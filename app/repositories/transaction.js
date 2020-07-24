const { Sequelize, sequelize } = require('../models');

var library = {};

/**
 * Create for init transaction
 * @return {Object} Object containing status and transaction or error object
 */
library.Create = async () => {
  try {
    const t = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.READ_UNCOMMITTED || "READ UNCOMMITTED"
    });

    return Promise.resolve({
      status: true,
      data: t
    });
  }
  catch (err) {
    return Promise.reject({
      status: false,
      err: err
    });
  }
};

/**
 * Commit transaction
 * @param  {Object} transactions Object of transaction
 * @return {Object}              Return object containing status adn or error object
 */
library.Commit = async (transactions) => {
  try {
    await transactions.commit();

    return Promise.resolve({
      status: true
    });
  }
  catch (err) {
    await library.Rollback(transactions);
    return Promise.reject({
      status: false,
      err: err
    });
  }
};

/**
 * Rollback transaction
 * @param  {Object} transactions Object of transaction
 * @return {Object}              Return object containing status and or error object
 */
library.Rollback = async (transactions) => {
  try {
    await transactions.rollback();

    return Promise.resolve({
      status: true
    });
  }
  catch (err) {
    return Promise.reject({
      status: false,
      err: err
    });
  }
};

module.exports = library;
