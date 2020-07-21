const encryption = require('./encryption');
const randomString = require('./randomString');

module.exports = () => {
  try {
    const rand = randomString(7);
    const encryptedKey = encryption.encrypt({
      plain: rand.string,
    });

    if (!encryptedKey.success) throw new Error(`error encrypting key`);

    return {
      success: true,
      data: {
      	plainKey: rand.string,
      	encryptedKey: encryptedKey.data
      }
    };
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: err.message,
    };
  }
};
