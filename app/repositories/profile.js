const flaverr = require('flaverr');

const { Profile, User, sequelize, Sequelize } = require('../models');

/**
 * Create a User Profile
 * @param {Object} data Data
 * @param {String} data.user_id UUID dari User
 * @param {String} data.first_name First Name
 * @param {String} data.last_name Last Name
 * @param {Object} transaction Transaction object
 * @returns Object containing status and data, or status and error
 */

const Create = async (data, transaction = {}) => {
  try {
    const profile = await Profile.create(data, { transaction });

    return {
      status: true,
      data: profile,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Find Profiles
 * @param {Object} params Params untuk filter data
 * @param {String} params.user_id UUID dari User
 * @param {Number} params.first_name First Name
 * @param {Number} params.last_name Last Name
 * @param {Object} pagination Pagination data
 * @param {Number} pagination.page Halaman data. Default 1
 * @param {Number} pagination.per_page Data yang ditampilkan per halaman. Default 20
 * @returns Object containing status and data, or status and error
 */

const FindMany = async (params, pagination = { page: 1, per_page: 20 }) => {
  try {
    const { user_id, first_name, last_name } = params;
    const page = parseInt(pagination.page) || 1;
    const per_page = parseInt(pagination.per_page) || 20;

    const where = {};
    user_id ? (where.user_id = { [Sequelize.Op.eq]: user_id }) : '';
    first_name
      ? (where.first_name = { [Sequelize.Op.like]: `%${first_name}%` })
      : '';
    last_name
      ? (where.last_name = { [Sequelize.Op.like]: `%${last_name}%` })
      : '';

    const { count, rows } = await Profile.findAndCountAll({
      offset: (page - 1) * per_page,
      limit: per_page,
      where: where,
    });

    if (!count) {
      throw flaverr('E_NOT_FOUND', Error('profile not found'));
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

/**
 * Find a Profile
 * @param {String} id UUID dari Profile
 * @returns Object containing status and data, or status and error
 */

const FindOne = async (id) => {
  try {
    const profile = await Profile.findOne({
      where: { id },
    });

    if (!profile) {
      throw flaverr('E_NOT_FOUND', Error(`profile with id ${id} is not found`));
    }

    return {
      status: true,
      data: profile,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

/**
 * Update a Profile
 * @param {String} id UUID dari Profile
 * @param {Object} data Data
 * @param {String} data.first_name First Name
 * @param {String} data.last_name Last Name
 * @returns Object containing status and data, or status and error
 */

const Update = async (id, data) => {
  try {
    const { first_name, last_name } = data;

    const profile = await FindOne(id);

    if (!profile.status) {
      throw profile.err;
    }

    const result = await sequelize.transaction(async (t) => {
      profile.data.first_name = first_name;
      profile.data.last_name = last_name;

      await profile.data.save({ transaction: t });
      return profile.data;
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

module.exports = {
  Create,
  FindMany,
  FindOne,
  Update,
};
