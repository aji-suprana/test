const jwt = require('jsonwebtoken');
const flaverr = require('flaverr');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw flaverr(
        'E_INVALID_TOKEN',
        Error('token authentication is required')
      );
    }

    const jwtToken = req.headers.authorization.split(/^Bearer\s+/);

    const decodedJWT = jwt.decode(jwtToken);

    req.user = decodedJWT;

    //TODO: Create core (core-add) called VobisAdmin, refer to https://drive.google.com/file/d/1hENrqYAS3klwjZQP3PYDZNqcHcIMSNYu/view?usp=sharing
    // Schema needed
    // Vobis Admin
    // --attributes {name:string}
    // {{vobis_admin_url}}/admin?user_id=<req.user.user_id>
    // if response failure
    //  then assign req.user.isAdmin = false
    // if exist
    //then assign req.user.isAdmin = true
    //else
    //then assign req.user.isAdmin = false

    if (req.user) {
      return next();
    } else {
      throw flaverr('E_INVALID_TOKEN', Error('invalid token'));
    }
  } catch (err) {
    return next(err);
  }
};
