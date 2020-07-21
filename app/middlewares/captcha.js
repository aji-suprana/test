const axios = require('axios').default;
const flaverr = require('flaverr');

const recaptcha = async (req, res, next) => {
  try {
    const secretKey = process.env.SECRET_KEY_RECAPTCHA;
    const { token } = req.body;

    const url = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await axios.post(url);

    if (!response.data.success) {
      throw flaverr('E_CAPTCHA', Error(response.data.error_codes));
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = recaptcha;
