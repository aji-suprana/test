const flaverr = require('flaverr');
const axios = require('axios').default;

const AuthorizationService = process.env.AUTHORIZATION_SERVICE;

const checkPermission = async (req, res, next) => {
  try {
    const isAdmin = req.user.is_admin;

    if (isAdmin) {
      return next();
    }

    const bearerToken = req.headers.authorization;
    const brand_id = req.headers['x-brand'];
    const method = req.method;
    const uri = `${req.baseUrl}${req.route.path}`;

    if (!brand_id) {
      throw flaverr('E_UNAUTHORIZED', Error('no x-brand'));
    }

    const data = { method, uri };
    const headers = {
      Authorization: bearerToken,
      ['x-brand']: brand_id,
    };

    try {
      await axios.post(
        `${AuthorizationService}/authorize/check-permission`,
        data,
        { headers }
      );

      return next();
    } catch (err) {
      if (err.response) {
        const error = err.response.data;
        throw flaverr(error.code, Error(error.message));
      }

      throw err;
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = checkPermission;
