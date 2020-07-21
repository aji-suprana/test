const axios = require('axios').default;
const flaverr = require('flaverr');

const AuthorizationService = process.env.AUTHORIZATION_SERVICE;

const getBrand = require('./brand');

const getRole = async (user_id, token) => {
  try {
    const brand = await getBrand(user_id, token);

    if (!brand.status) {
      throw brand.err;
    }

    const [brand_id] = brand.data.data.data.map((item) => item.id);

    const headers = {
      Authorization: `Bearer ${token}`,
      ['x-brand']: brand_id,
    };

    try {
      const userRole = await axios.get(`${AuthorizationService}/user-role`, {
        headers,
      });

      const [role_id] = userRole.data.data.data
        .filter((item) => item.user_id === user_id)
        .map((item) => item.role_id);

      return {
        status: true,
        data: role_id,
      };
    } catch (err) {
      if (err.response) {
        const error = err.response.data;
        throw flaverr('E_INTERNAL_SERVER', Error(error.message));
      }

      throw err;
    }
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = getRole;
