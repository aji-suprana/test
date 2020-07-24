const flaverr = require('flaverr');

const check = (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin;
    const brands = req.user.brand_id;
    const brand_id = req.headers['brand-id'];

    if (isAdmin) {
      return next();
    }

    // kalau kosong ditolak
    if (!brands.length) {
      throw flaverr('E_UNAUTHORIZED', Error('check brand failed'));
    }

    // check apakah ada brand_id yg dikirim dari header
    const checkBrand = brands.find((brand) => brand === brand_id);

    if (!checkBrand) {
      throw flaverr('E_UNAUTHORIZED', Error('check brand failed'));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = check;
