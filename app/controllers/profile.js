const { success } = require('../services/httpRes');

const profileRepository = require('../repositories/profile');

const CreateNewProfile = async (req, res, next) => {
  try {
    const { user_id, first_name, last_name } = req.body;
    const profileData = { user_id, first_name, last_name };

    const profile = await profileRepository.Create(profileData);

    if (!profile.status) {
      throw profile.err;
    }

    return success(res, 201, profile.data);
  } catch (err) {
    return next(err);
  }
};

const FindAllProfiles = async (req, res, next) => {
  try {
    const { user_id, first_name, last_name, page, per_page } = req.query;
    const params = { user_id, first_name, last_name };
    const pagination = { page, per_page };

    const profiles = await profileRepository.FindMany(params, pagination);

    if (!profiles.status) {
      throw profiles.err;
    }

    return success(res, 200, profiles.data);
  } catch (err) {
    return next(err);
  }
};

const FindOneProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await profileRepository.FindOne(id);

    if (!profile.status) {
      throw profile.err;
    }

    return success(res, 200, profile.data);
  } catch (err) {
    return next(err);
  }
};

const UpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;

    const profileData = { first_name, last_name };
    const profile = await profileRepository.Update(id, profileData);

    if (!profile.status) {
      throw profile.err;
    }

    return success(res, 201, profile.data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  CreateNewProfile,
  FindAllProfiles,
  FindOneProfile,
  UpdateProfile,
};
