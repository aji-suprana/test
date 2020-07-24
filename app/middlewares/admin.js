const flaverr = require('flaverr');

const check = (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      throw flaverr('E_FORBIDDEN', Error('you are not admin'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = check;
