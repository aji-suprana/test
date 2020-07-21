const axios = require('axios').default;

const BrandService = process.env.BRAND_SERVICE;

const getBrand = async (owner_id, token) => {
  try {
    const brands = await axios.get(
      `${BrandService}/brand?owner_id=${owner_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      status: true,
      data: brands.data,
    };
  } catch (err) {
    return {
      status: false,
      err: err,
    };
  }
};

module.exports = getBrand;
